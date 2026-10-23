"""Content files (images, audio, PDFs, reports): local folders, or the DataKey file store when DOSYA_URL is set.

Every call takes a logical name ("question_images/X.png") and the local path the app used before.
Locally only the path is used, so the single-computer setup is unchanged.

The store is public, so files only the parent may see (reading answer images, the PDFs with
their answer-key pages, audit reports) are uploaded encrypted with AES-256-GCM under
"gizli/<name>.enc". The key (DOSYA_ANAHTARI) exists only on the server.
"""

from __future__ import annotations

import base64
import hashlib
import mimetypes
import os
import re
import secrets
import tempfile
import threading
import time
import urllib.error
import urllib.request
from collections import OrderedDict
from pathlib import Path

DOSYA_URL = os.environ.get("DOSYA_URL", "").strip().rstrip("/")
DOSYA_TOKEN = os.environ.get("DOSYA_TOKEN", "").strip()
DOSYA_ANAHTARI = os.environ.get("DOSYA_ANAHTARI", "").strip()
IS_REMOTE = bool(DOSYA_URL)

SECRET = re.compile(r"reading_images/R\d{2}_A\d{2}\.png|.+\.pdf|data/.+")
NAME = re.compile(r"[A-Za-z0-9._/-]{1,480}")
MAGIC = b"CIO1"
TIMEOUT = 60
# The store accepts at most 25 MB per object; larger files are kept as parts "<name>", "<name>.2", ...
PART_SIZE = 24 * 1024 * 1024
MEMORY_LIMIT = 64 * 1024 * 1024
MEMORY_ITEM_LIMIT = 4 * 1024 * 1024
FILE_CACHE = Path(tempfile.gettempdir()) / "cio_dosya"
FILE_CACHE_LIMIT = 8

_memory: OrderedDict[str, bytes] = OrderedDict()
_memory_size = 0
_lock = threading.Lock()


class StorageError(ValueError):
    pass


def is_secret(name):
    return bool(SECRET.fullmatch(name))


def remote_name(name):
    if not NAME.fullmatch(name) or ".." in name.split("/"):
        raise StorageError("Geçersiz dosya adı.")
    return f"gizli/{name}.enc" if is_secret(name) else name


def _key():
    try:
        key = base64.urlsafe_b64decode(DOSYA_ANAHTARI + "=" * (-len(DOSYA_ANAHTARI) % 4))
    except ValueError:
        key = b""
    if len(key) != 32:
        raise StorageError("DOSYA_ANAHTARI tanımlı değil veya geçersiz.")
    return key


def new_key():
    return base64.urlsafe_b64encode(secrets.token_bytes(32)).decode().rstrip("=")


def encrypt(name, data):
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    nonce = secrets.token_bytes(12)
    return MAGIC + nonce + AESGCM(_key()).encrypt(nonce, data, name.encode())


def decrypt(name, blob):
    from cryptography.exceptions import InvalidTag
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    if not blob.startswith(MAGIC) or len(blob) < len(MAGIC) + 12 + 16:
        raise StorageError("Şifreli dosya bozuk.")
    try:
        return AESGCM(_key()).decrypt(blob[4:16], blob[16:], name.encode())
    except InvalidTag:
        raise StorageError("Şifreli dosya açılamadı (anahtar yanlış olabilir).") from None


def _part_name(name, part):
    return remote_name(name) if part == 1 else f"{remote_name(name)}.{part}"


def _request(method, name, data=None, headers=None, part=1):
    url = f"{DOSYA_URL}/{_part_name(name, part)}"
    for attempt in range(3):
        request = urllib.request.Request(url, data=data, method=method,
                                         headers={"Authorization": f"Bearer {DOSYA_TOKEN}", **(headers or {})})
        try:
            return urllib.request.urlopen(request, timeout=TIMEOUT)
        except urllib.error.HTTPError as error:
            if error.code == 404:
                return None
            if error.code == 416:
                return error
            raise StorageError(f"Dosya deposu hata verdi ({error.code}).") from None
        except (urllib.error.URLError, TimeoutError, ConnectionError) as error:
            # The network guard in front of the store sometimes resets a connection; all the
            # methods used here are idempotent, so they are retried.
            if attempt == 2:
                raise StorageError("Dosya deposuna ulaşılamadı.") from error
            time.sleep(0.5 + attempt)


def _remember(name, data):
    global _memory_size
    with _lock:
        old = _memory.pop(name, None)
        if old is not None:
            _memory_size -= len(old)
        if data is None or len(data) > MEMORY_ITEM_LIMIT:
            return
        _memory[name] = data
        _memory_size += len(data)
        while _memory_size > MEMORY_LIMIT:
            _memory_size -= len(_memory.popitem(last=False)[1])


def _download(name):
    # no-cache: a corrected crop must not come back from an intermediate cache.
    parts, part = [], 1
    while True:
        response = _request("GET", name, headers={"Cache-Control": "no-cache"}, part=part)
        if response is None:
            if part == 1:
                return None
            break
        with response:
            parts.append(response.read())
        if len(parts[-1]) < PART_SIZE:
            break
        part += 1
    blob = b"".join(parts)
    return decrypt(name, blob) if is_secret(name) else blob


def read(name, local: Path):
    """The file's bytes, or None when it does not exist."""
    if not IS_REMOTE:
        return local.read_bytes() if local.is_file() else None
    with _lock:
        if name in _memory:
            _memory.move_to_end(name)
            return _memory[name]
    data = _download(name)
    _remember(name, data)
    return data


def write(name, local: Path, data: bytes):
    if not IS_REMOTE:
        local.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(dir=local.parent, suffix=local.suffix, delete=False) as target:
            temporary = Path(target.name)
        try:
            temporary.write_bytes(data)
            os.replace(temporary, local)
        finally:
            temporary.unlink(missing_ok=True)
        return
    content_type = "application/octet-stream" if is_secret(name) else (
        mimetypes.guess_type(name)[0] or "application/octet-stream")
    body = encrypt(name, data) if is_secret(name) else data
    chunks = [body[start:start + PART_SIZE] for start in range(0, len(body), PART_SIZE)] or [b""]
    for part, chunk in enumerate(chunks, 1):
        response = _request("PUT", name, data=chunk, headers={"Content-Type": content_type}, part=part)
        if response is None or response.status not in (200, 201):
            raise StorageError("Dosya depoya yazılamadı.")
        response.close()
    part = len(chunks) + 1  # parts left over from a larger earlier version
    while (response := _request("DELETE", name, part=part)) is not None:
        response.close()
        part += 1
    _remember(name, data)
    for cached in FILE_CACHE.glob(f"{_cache_stem(name)}*"):
        cached.unlink(missing_ok=True)


def exists(name, local: Path):
    if not IS_REMOTE:
        return local.is_file()
    response = _request("HEAD", name)
    if response is None:
        return False
    response.close()
    return True


def remote_size(name):
    """Size stored in the store over all parts (encrypted size for secret files), or None."""
    total, part = 0, 1
    while True:
        response = _request("HEAD", name, part=part)
        if response is None:
            return None if part == 1 else total
        with response:
            size = int(response.headers.get("Content-Length", "-1"))
        total += size
        if size < PART_SIZE:
            return total
        part += 1


def _cache_stem(name):
    return hashlib.sha256(name.encode()).hexdigest()[:24]


def local_file(name, local: Path):
    """A readable path for libraries that need a file (PDF rendering), or None."""
    if not IS_REMOTE:
        return local if local.is_file() else None
    FILE_CACHE.mkdir(parents=True, exist_ok=True)
    cached = FILE_CACHE / f"{_cache_stem(name)}{Path(name).suffix}"
    if cached.is_file():
        os.utime(cached)
        return cached
    data = _download(name)
    if data is None:
        return None
    with tempfile.NamedTemporaryFile(dir=FILE_CACHE, delete=False) as target:
        target.write(data)
        temporary = Path(target.name)
    os.replace(temporary, cached)
    files = sorted(FILE_CACHE.glob("*.*"), key=lambda path: path.stat().st_mtime)
    for old in files[:-FILE_CACHE_LIMIT]:
        old.unlink(missing_ok=True)
    return cached


def open_range(name, range_header):
    """Streams a public (not encrypted) file from the store, passing the Range header through.

    Returns the HTTP response (status 200, 206 or 416) or None when the file does not exist.
    """
    if is_secret(name):
        raise StorageError("Şifreli dosya parça parça okunamaz.")
    # Only the first part is streamed; the audio files are well under PART_SIZE.
    return _request("GET", name, headers={"Range": range_header} if range_header else None)
