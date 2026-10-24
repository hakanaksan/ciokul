"""Local parent/student workbook app. Run with Python 3.10+."""

from __future__ import annotations

import hashlib
import hmac
import json
import mimetypes
import os
import re
import secrets
import shutil
import sqlite3
import threading
import time
import tempfile
import webbrowser
import zipfile
from contextlib import closing
from datetime import date
from io import BytesIO
from http import HTTPStatus
from http.cookies import CookieError, SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from curriculum_schedule import MONTHS, SCHOOL_YEAR, SOURCES, annotate_booklet
import data_export
import database
import reading_module
import storage
import study_features


BASE = Path(__file__).resolve().parent
DATA = BASE / "data"
DB_PATH = DATA / "cio_okul.sqlite3"
WEB = BASE / "web"
PDF = BASE / "4_sinif_fasikulleri" / "Din_Kulturu_ve_Ahlak_Bilgisi" / "unite_01.pdf"
QUESTION_IMAGES = BASE / "question_images"
READING_AUDIO = BASE / "reading_audio"
# Server settings; the defaults keep the local single-computer setup unchanged.
HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "8765"))
SETUP_TOKEN = os.environ.get("SETUP_TOKEN", "")
SETUP_TOKEN_REQUIRED = bool(SETUP_TOKEN) or HOST not in ("127.0.0.1", "localhost", "::1")
TRUST_PROXY = os.environ.get("TRUST_PROXY") == "1"
COOKIE_SECURE = os.environ.get("COOKIE_SECURE") == "1"
SESSION_SECONDS = 60 * 60 * 12
# Cache of the sessions table: SHA-256 of the cookie token -> (role, expires_at).
SESSIONS: dict[str, tuple[str, float]] = {}
LOGIN_WINDOW = 15 * 60
LOGIN_LIMITS = {"ip": 8, "role": 30}
LOGIN_FAILURES: dict[str, list[float]] = {}
LOGIN_LOCK = threading.Lock()
DB_LOCK = threading.RLock()
TEST_SIZE = 15
BACKUP_NAME = "cio_okul_yedek.zip"
BACKUP_JSON = "cio_okul.json"
BACKUPS_DIR = DATA / "backups"
MAX_AUTO_BACKUPS = 7


def create_auto_backup():
    """Takes a consistent rolling snapshot of cio_okul.sqlite3 into data/backups/."""
    if database.IS_POSTGRES:
        return
    try:
        BACKUPS_DIR.mkdir(parents=True, exist_ok=True)
        today_str = date.today().isoformat()
        backup_file = BACKUPS_DIR / f"cio_okul_{today_str}.sqlite3"
        with DB_LOCK, closing(connect()) as source, closing(sqlite3.connect(backup_file)) as destination:
            source.backup(destination)
        existing = sorted(BACKUPS_DIR.glob("cio_okul_*.sqlite3"), key=lambda p: p.stat().st_mtime)
        while len(existing) > MAX_AUTO_BACKUPS:
            old = existing.pop(0)
            old.unlink(missing_ok=True)
    except Exception as exc:
        print(f"[Otomatik Yedekleme Hatası] {exc}")

QUESTIONS = [
    (1, 6, "Günlük hayatta kullandığımız kelime ve ifadelerin bazılarının kaynağı dindir. Bu ifadeler dilimize ve kültürümüze yerleşmiş, hayatımızın ayrılmaz parçaları olmuştur.\nBuna göre hangisi günlük hayatımızda kullandığımız dinî ifadelerden biridir?", ["Kolay gelsin", "Günaydın", "Maşallah", "Merhaba"], "C"),
    (2, 6, "Babaannesiyle pazar alışverişine giden Aysun, ‘Babaanne, alışveriş yaptıktan sonra pazarcı teyzelere ve amcalara ne dememiz gerekiyor?’ diye sordu.\nBabaannesinin Aysun’a verdiği cevap aşağıdakilerden hangisidir?", ["Allah bereket versin.", "Allah şifa versin.", "Allah sabır versin.", "Allah rahatlık versin."], "A"),
    (3, 6, "Allah’ın yüceliğini ve tüm varlıklardan üstün olduğunu vurgulama ifadesi hangisidir?", ["Salavat", "Şükür", "Hamd", "Tekbir"], "D"),
    (4, 6, "İnsanlar konuşmalarına genellikle selamlaşma ile başlar.\nAşağıdakilerden hangisi aynı zamanda bir dua olan ve İslam dininin tavsiye ettiği selamlaşma ifadesidir?", ["Merhaba", "Günaydın", "İyi günler", "Selamün aleyküm"], "D"),
    (5, 6, "Dördüncü sınıf öğrencisi Ömer’in ödevinde iki boşluk doldurma sorusu vardır:\n• Yüce Allah’ın izin verdiği ve serbest bıraktığı iş ve davranışlara ---- denir.\n• Allah’ın yapılmasını kesin olarak yasakladığı söz ve davranışlara ---- denir.\nBoşluklara sırasıyla yazılması gereken kavramlar hangileridir?", ["helal - haram", "haram - sevap", "helal - sevap", "haram - helal"], "A"),
    (6, 7, "Ceren Öğretmen, günlük hayatta dinî ifadeleri doğru ve yerinde kullanmanın önemini anlatıyor.\nAhmet: Yolculuğa çıkan birine ‘Allah’a emanet ol!’ derim.\nAli: Bebeği olan bir aileye ‘Allah bağışlasın.’ derim.\nAyşe: Yapacağım bir iş için ‘İnşallah.’ derim.\nFatma: Yemeğe başlarken ‘Allah korusun!’ derim.\nYukarıdaki öğrencilerden hangisi dinî ifadeyi yanlış yerde kullanmıştır?", ["Ahmet", "Ali", "Ayşe", "Fatma"], "D"),
    (7, 7, "Allah’ı yüceltmek amacıyla söylenen ‘tekbir’ ifadesi, günlük hayatımızda farklı durum ve amaçlarda kullanılır.\nAşağıdakilerin hangisi bunlardan biri değildir?", ["Namaza başlamak için", "Kurban Bayramı günlerinde", "Hz. Peygamber’in adı anılınca", "Ezan sözlerinde"], "C"),
    (8, 7, "‘Rabb’inizden bağışlanma dileyin, sonra ona tövbe edin. Şüphesiz Rabb’im çok merhametlidir, çok sevendir.’ (Hûd suresi, 90. ayet)\nBu ayette, yapılması istenen dua hangisi olabilir?", ["Elhamdülillah", "İnşallah", "Estağfirullah", "Sübhânallah"], "C"),
    (9, 7, "Elif: Allah en büyüktür. Mehmet: Allah, ona (Hz. Muhammed) salat ve selam eylesin.\nElif ile Mehmet’in söylediği ifadeler, aşağıdaki kavramlardan hangilerinin anlamıdır?", ["Tekbir - Salavat", "Salavat - Sübhaneke", "Tekbir - Sübhaneke", "Salavat - Selam"], "A"),
    (10, 8, "Eymen, öğle arası arkadaşlarını yemeğe davet etmişti. Hepsi yemeğe besmele ile başladı. Yemekten sonra da verdiği bu nimetlerden dolayı Allah’a şükrettiler.\nBu metinde kastedilen iki dinî ifade hangisinde sırasıyla verilmiştir?", ["Bismillâhirrahmânirrahîm - Estağfirullah", "Sübhânallah - Elhamdülillah", "Bismillâhirrahmânirrahîm - Elhamdülillah", "Sübhânallah - Estağfirullah"], "C"),
    (11, 8, "Yüce Allah Kur’an-ı Kerim’de ‘Yalnız beni anın ki ben de sizi anayım. Bana şükredin, sakın nankörlük etmeyin.’ (Bakara suresi, 152. ayet) ayetiyle kendisine şükredilmesini ve nankörlükten uzak durulmasını emretmektedir.\nBuna göre hangisi Allah’a şükür için kullanılan ifadelerdendir?", ["Elhamdülillah", "İnşallah", "Estağfirullah", "Maşallah"], "A"),
    (12, 8, "Görselde sevap örnekleri bir şemada verilmiştir.\nŞemada noktalı yerlere hangisi getirilemez?", ["Başkaları ile iyi geçinmek", "Yaşlılara yardım etmek", "Çevreyi korumak", "Düşüncesizce davranmak"], "D"),
]


TR_MAP = str.maketrans({
    "İ": "i", "I": "i", "ı": "i",
    "Ş": "s", "ş": "s",
    "Ç": "c", "ç": "c",
    "Ğ": "g", "ğ": "g",
    "Ö": "o", "ö": "o",
    "Ü": "u", "ü": "u",
    "Â": "a", "â": "a",
    "Î": "i", "î": "i",
    "Û": "u", "û": "u",
})


def turkish_normalize(text: str) -> str:
    if not text:
        return ""
    return str(text).translate(TR_MAP).lower()


def connect():
    if not database.IS_POSTGRES:
        DATA.mkdir(exist_ok=True)
    return database.connect(DB_PATH, {"TR_NORM": turkish_normalize})


def init_db():
    if not database.IS_POSTGRES:
        DATA.mkdir(exist_ok=True)
        restore_pending()
    with connect() as db:
        if database.IS_POSTGRES:
            database.apply_postgres_schema(db)
        else:
            db.executescript("""
            CREATE TABLE IF NOT EXISTS users (
              role TEXT PRIMARY KEY CHECK(role IN ('parent','student')),
              name TEXT NOT NULL,
              salt TEXT NOT NULL,
              secret_hash TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS booklets (
              id INTEGER PRIMARY KEY,
              course TEXT NOT NULL,
              title TEXT NOT NULL,
              pdf_path TEXT NOT NULL,
              source_url TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS questions (
              id INTEGER PRIMARY KEY,
              booklet_id INTEGER NOT NULL REFERENCES booklets(id),
              number INTEGER NOT NULL,
              page INTEGER NOT NULL,
              kind TEXT NOT NULL,
              stem TEXT NOT NULL,
              answer_key TEXT NOT NULL,
              verified INTEGER NOT NULL DEFAULT 0,
              image_path TEXT,
              UNIQUE(booklet_id, number)
            );
            CREATE TABLE IF NOT EXISTS choices (
              question_id INTEGER NOT NULL REFERENCES questions(id),
              label TEXT NOT NULL,
              text TEXT NOT NULL,
              PRIMARY KEY(question_id, label)
            );
            CREATE TABLE IF NOT EXISTS assignments (
              id INTEGER PRIMARY KEY,
              title TEXT NOT NULL,
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
              submitted_at TEXT
            );
            CREATE TABLE IF NOT EXISTS assignment_questions (
              assignment_id INTEGER NOT NULL REFERENCES assignments(id),
              question_id INTEGER NOT NULL REFERENCES questions(id),
              position INTEGER NOT NULL,
              PRIMARY KEY(assignment_id, question_id)
            );
            CREATE TABLE IF NOT EXISTS responses (
              assignment_id INTEGER NOT NULL,
              question_id INTEGER NOT NULL,
              choice TEXT NOT NULL,
              updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
              PRIMARY KEY(assignment_id, question_id),
              FOREIGN KEY(assignment_id, question_id)
                REFERENCES assignment_questions(assignment_id, question_id)
            );
            CREATE TABLE IF NOT EXISTS reviews (
              assignment_id INTEGER NOT NULL,
              question_id INTEGER NOT NULL,
              grade TEXT NOT NULL CHECK(grade IN ('correct','incorrect','partial')),
              note TEXT NOT NULL DEFAULT '',
              reviewed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
              PRIMARY KEY(assignment_id, question_id),
              FOREIGN KEY(assignment_id, question_id)
                REFERENCES assignment_questions(assignment_id, question_id)
            );
            CREATE TABLE IF NOT EXISTS question_flags (
              question_id INTEGER PRIMARY KEY REFERENCES questions(id),
              note TEXT NOT NULL DEFAULT '',
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS plan_overrides (
              booklet_id INTEGER NOT NULL REFERENCES booklets(id),
              test_index INTEGER NOT NULL,
              year_month TEXT NOT NULL,
              PRIMARY KEY(booklet_id,test_index)
            );
            CREATE TABLE IF NOT EXISTS settings (
              key TEXT PRIMARY KEY,
              value TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS mistake_resolutions (
              kind TEXT NOT NULL,
              item_key TEXT NOT NULL,
              resolved_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
              PRIMARY KEY(kind, item_key)
            );
            CREATE TABLE IF NOT EXISTS sessions (
              token_hash TEXT PRIMARY KEY,
              role TEXT NOT NULL CHECK(role IN ('parent','student')),
              expires_at INTEGER NOT NULL
            );
            """)
            columns = {row[1] for row in db.execute("PRAGMA table_info(questions)")}
            if "image_path" not in columns:
                db.execute("ALTER TABLE questions ADD COLUMN image_path TEXT")
            assignment_columns = {row[1] for row in db.execute("PRAGMA table_info(assignments)")}
            if "due_date" not in assignment_columns:
                db.execute("ALTER TABLE assignments ADD COLUMN due_date TEXT")
            if "last_question_index" not in assignment_columns:
                db.execute("ALTER TABLE assignments ADD COLUMN last_question_index INTEGER NOT NULL DEFAULT 0")
            resp_columns = {row[1] for row in db.execute("PRAGMA table_info(responses)")}
            if "duration_seconds" not in resp_columns:
                db.execute("ALTER TABLE responses ADD COLUMN duration_seconds INTEGER NOT NULL DEFAULT 0")
        reading_module.install(db)
        study_features.install(db)
        db.execute("INSERT INTO booklets VALUES (1,?,?,?,?) ON CONFLICT DO NOTHING", (
            "Din Kültürü ve Ahlak Bilgisi", "Ünite 01",
            str(PDF.relative_to(BASE)),
            "https://odsgm.meb.gov.tr/www/4-sinif-calisma-fasikulleri/icerik/615",
        ))
        db.executemany("""INSERT INTO questions(id,booklet_id,number,page,kind,stem,answer_key,verified)
            VALUES (?,?,?,?,?,?,?,1) ON CONFLICT DO NOTHING""",
            [(number, 1, number, page, "multiple_choice", stem, answer)
             for number, page, stem, choices, answer in QUESTIONS])
        db.executemany("UPDATE questions SET image_path=? WHERE id=?",
                       [(f"DKAB_U01_S{number:03}.png", number) for number, *_ in QUESTIONS])
        db.executemany("INSERT INTO choices VALUES (?,?,?) ON CONFLICT DO NOTHING",
                       [(number, label, choice) for number, page, stem, choices, answer in QUESTIONS
                        for label, choice in zip("ABCD", choices)])
        database.sync_identities(db, ("booklets", "questions", "assignments",
                                      "reading_sections", "reading_assignments"))
        create_auto_backup()


def hash_secret(secret: str, salt: str) -> str:
    return hashlib.pbkdf2_hmac("sha256", secret.encode(), bytes.fromhex(salt), 310_000).hex()


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def create_session(role):
    """Stores a new session and returns the cookie token. Sessions survive restarts and deploys."""
    token = secrets.token_urlsafe(32)
    key, now = token_hash(token), int(time.time())
    expires = now + SESSION_SECONDS
    with DB_LOCK, connect() as db:
        db.execute("DELETE FROM sessions WHERE expires_at < ?", (now,))
        db.execute("INSERT INTO sessions VALUES (?,?,?)", (key, role, expires))
    SESSIONS[key] = (role, expires)
    return token


def session_role(token):
    key, now = token_hash(token), time.time()
    cached = SESSIONS.get(key)
    if cached and cached[1] > now:
        return cached[0]
    with connect() as db:
        row = db.execute("SELECT role, expires_at FROM sessions WHERE token_hash=?", (key,)).fetchone()
    if not row or row[1] < now:
        SESSIONS.pop(key, None)
        return None
    SESSIONS[key] = (row[0], row[1])
    return row[0]


def end_session(token):
    key = token_hash(token)
    SESSIONS.pop(key, None)
    with DB_LOCK, connect() as db:
        db.execute("DELETE FROM sessions WHERE token_hash=?", (key,))


def clear_sessions():
    SESSIONS.clear()
    with DB_LOCK, connect() as db:
        db.execute("DELETE FROM sessions")


def end_other_sessions(keep_token, role=None):
    """Signs out every session except keep_token (only `role` sessions when given); returns the count."""
    keep = token_hash(keep_token) if keep_token else ""
    with DB_LOCK, connect() as db:
        if role:
            ended = db.execute("DELETE FROM sessions WHERE token_hash<>? AND role=?", (keep, role)).rowcount
        else:
            ended = db.execute("DELETE FROM sessions WHERE token_hash<>?", (keep,)).rowcount
    for key in [key for key, (session, _) in SESSIONS.items() if key != keep and (not role or session == role)]:
        SESSIONS.pop(key, None)
    return ended


def login_blocked(keys):
    """True when any key (client address, role) had too many failed attempts in the window."""
    now = time.time()
    with LOGIN_LOCK:
        for key in keys:
            recent = [moment for moment in LOGIN_FAILURES.get(key, []) if now - moment < LOGIN_WINDOW]
            LOGIN_FAILURES[key] = recent
            if len(recent) >= LOGIN_LIMITS[key.split(":", 1)[0]]:
                return True
    return False


def record_login_failure(keys):
    with LOGIN_LOCK:
        for key in keys:
            LOGIN_FAILURES.setdefault(key, []).append(time.time())


def rows(db, sql, params=()):
    return [dict(row) for row in db.execute(sql, params)]


def pdf_for_booklet(db, booklet_id):
    source = db.execute("SELECT pdf_path FROM booklets WHERE id=?", (booklet_id,)).fetchone()
    if not source:
        raise ValueError("Fasikül bulunamadı.")
    name = Path(source[0]).as_posix()
    local = (BASE / name).resolve()
    if not local.is_relative_to((BASE / "4_sinif_fasikulleri").resolve()):
        raise ValueError("PDF bulunamadı.")
    path = storage.local_file(name, local)
    if path is None:
        raise ValueError("PDF bulunamadı.")
    return path


def render_page(pdf_path, page_number, scale=1.6):
    import pypdfium2
    with pypdfium2.PdfDocument(str(pdf_path)) as document:
        if page_number < 1 or page_number > len(document):
            raise ValueError("PDF sayfası bulunamadı.")
        page = document[page_number - 1]
        return page.render(scale=scale).to_pil().convert("RGB")


def checked_date(value):
    if value in (None, ""):
        return None
    if not isinstance(value, str) or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
        raise ValueError("Hedef tarihi geçersiz.")
    date.fromisoformat(value)
    return value


def validate_backup(path):
    with zipfile.ZipFile(path) as archive:
        names = set()
        total = 0
        for info in archive.infolist():
            name = info.filename
            if name in names or (name != "cio_okul.sqlite3" and
                    not re.fullmatch(r"(?:question_images/[A-Z0-9_]+|reading_images/R\d{2}_[PQA]\d{2})\.png", name)):
                raise ValueError("Yedekte geçersiz dosya var.")
            names.add(name)
            total += info.file_size
            if info.file_size > 150_000_000 or total > 6_000_000_000:
                raise ValueError("Yedek dosyası çok büyük.")
        if "cio_okul.sqlite3" not in names or archive.testzip():
            raise ValueError("Yedek eksik veya bozuk.")
        with tempfile.TemporaryDirectory(dir=DATA) as directory:
            database_file = Path(directory) / "test.sqlite3"
            with archive.open("cio_okul.sqlite3") as source, database_file.open("wb") as target:
                shutil.copyfileobj(source, target)
            with closing(sqlite3.connect(database_file)) as check:
                if check.execute("PRAGMA integrity_check").fetchone()[0] != "ok":
                    raise ValueError("Yedek veritabanı bozuk.")
                required = {"users", "booklets", "questions", "assignments", "responses", "reviews"}
                actual = {row[0] for row in check.execute("SELECT name FROM sqlite_master WHERE type='table'")}
                if not required.issubset(actual):
                    raise ValueError("Yedek bu uygulamaya ait değil.")


def restore_postgres_backup(path):
    """Restores a backup ZIP into PostgreSQL in one transaction.

    Accepts the server's JSON backups and the local app's SQLite backups. Images in the ZIP are
    not restored here; their count is returned. Everyone is signed out afterwards.
    """
    with zipfile.ZipFile(path) as archive:
        names = set(archive.namelist())
        if archive.testzip():
            raise ValueError("Yedek eksik veya bozuk.")
        if BACKUP_JSON in names:
            if archive.getinfo(BACKUP_JSON).file_size > 300_000_000:
                raise ValueError("Yedek dosyası çok büyük.")
            payload = json.loads(archive.read(BACKUP_JSON).decode("utf-8"))
        elif "cio_okul.sqlite3" in names:
            info = archive.getinfo("cio_okul.sqlite3")
            if info.file_size > 150_000_000:
                raise ValueError("Yedek dosyası çok büyük.")
            with tempfile.TemporaryDirectory() as directory:
                database_file = Path(directory) / "backup.sqlite3"
                with archive.open(info) as source, database_file.open("wb") as target:
                    shutil.copyfileobj(source, target)
                payload = data_export.read_sqlite(database_file)
        else:
            raise ValueError("Yedekte veritabanı yok.")
        images = sum(1 for name in names if name.endswith(".png"))
    with DB_LOCK, connect() as db:
        counts = data_export.restore_tables(db, payload)
    clear_sessions()
    return counts, images


def restore_pending():
    pending = DATA / "pending_restore.zip"
    if not pending.is_file():
        return
    with tempfile.TemporaryDirectory(dir=BASE) as temporary:
        stage = Path(temporary)
        with zipfile.ZipFile(pending) as archive:
            names = set(archive.namelist())
            if "cio_okul.sqlite3" not in names:
                raise ValueError("Yedekte veritabanı yok.")
            for info in archive.infolist():
                name = info.filename
                if name != "cio_okul.sqlite3" and not re.fullmatch(r"(?:question_images/[A-Z0-9_]+|reading_images/R\d{2}_[PQA]\d{2})\.png", name):
                    raise ValueError("Yedekte geçersiz dosya adı var.")
                if info.file_size > 150_000_000:
                    raise ValueError("Yedekte çok büyük bir dosya var.")
                destination = stage / name
                destination.parent.mkdir(parents=True, exist_ok=True)
                with archive.open(info) as source, destination.open("wb") as target:
                    shutil.copyfileobj(source, target)
        incoming_db = stage / "cio_okul.sqlite3"
        with closing(sqlite3.connect(incoming_db)) as check:
            if check.execute("PRAGMA integrity_check").fetchone()[0] != "ok":
                raise ValueError("Yedek veritabanı bozuk.")
            required = {"users", "booklets", "questions", "assignments", "responses", "reviews"}
            actual = {row[0] for row in check.execute("SELECT name FROM sqlite_master WHERE type='table'")}
            if not required.issubset(actual):
                raise ValueError("Yedek bu uygulamaya ait değil.")
        QUESTION_IMAGES.mkdir(exist_ok=True)
        for image in (stage / "question_images").glob("*.png") if (stage / "question_images").exists() else []:
            with tempfile.NamedTemporaryFile(dir=QUESTION_IMAGES,suffix=".png",delete=False) as target:
                temporary=Path(target.name)
            try:
                shutil.copy2(image,temporary)
                os.replace(temporary, QUESTION_IMAGES / image.name)
            finally:
                temporary.unlink(missing_ok=True)
        reading_module.IMAGES.mkdir(exist_ok=True)
        for image in (stage / "reading_images").glob("*.png") if (stage / "reading_images").exists() else []:
            with tempfile.NamedTemporaryFile(dir=reading_module.IMAGES,suffix=".png",delete=False) as target:
                temporary=Path(target.name)
            try:
                shutil.copy2(image,temporary)
                os.replace(temporary, reading_module.IMAGES / image.name)
            finally:
                temporary.unlink(missing_ok=True)
        DATA.mkdir(exist_ok=True)
        with tempfile.NamedTemporaryFile(dir=DATA,suffix=".sqlite3",delete=False) as target:
            temporary=Path(target.name)
        try:
            shutil.copy2(incoming_db,temporary)
            os.replace(temporary,DB_PATH)
        finally:
            temporary.unlink(missing_ok=True)
    pending.unlink()


def calculate_badges(db):
    test_submits = db.execute("SELECT id, title, submitted_at, due_date FROM assignments WHERE submitted_at IS NOT NULL").fetchall()
    read_submits = db.execute("SELECT id, title, submitted_at, due_date FROM reading_assignments WHERE submitted_at IS NOT NULL").fetchall()
    total_submitted = len(test_submits) + len(read_submits)
    read_count = len(read_submits)

    courses_completed = {r[0] for r in db.execute("""
        SELECT DISTINCT b.course FROM assignments a
        JOIN assignment_questions aq ON aq.assignment_id = a.id
        JOIN questions q ON q.id = aq.question_id
        JOIN booklets b ON b.id = q.booklet_id
        WHERE a.submitted_at IS NOT NULL
    """).fetchall()}

    on_time_count = 0
    for s in list(test_submits) + list(read_submits):
        if s["due_date"] and s["submitted_at"]:
            sub_date = s["submitted_at"][:10]
            if sub_date <= s["due_date"]:
                on_time_count += 1

    resolved_mistakes = db.execute("SELECT COUNT(*) FROM mistake_resolutions").fetchone()[0]

    perfect_tests = db.execute("""
        SELECT COUNT(*) FROM (
            SELECT a.id, COUNT(aq.question_id) AS total_q,
                   SUM(CASE WHEN r.grade = 'correct' THEN 1 ELSE 0 END) AS correct_q
            FROM assignments a
            JOIN assignment_questions aq ON aq.assignment_id = a.id
            JOIN reviews r ON r.assignment_id = a.id AND r.question_id = aq.question_id
            WHERE a.submitted_at IS NOT NULL
            GROUP BY a.id
            HAVING COUNT(aq.question_id) > 0
               AND COUNT(aq.question_id) = SUM(CASE WHEN r.grade = 'correct' THEN 1 ELSE 0 END)
        ) AS graded
    """).fetchone()[0]

    study_dates = {s["submitted_at"][:10] for s in list(test_submits) + list(read_submits) if s["submitted_at"]}
    active_days_count = len(study_dates)

    badges = [
        {
            "id": "first_step",
            "title": "İlk Adım",
            "desc": "İlk çalışmanı başarıyla tamamlayıp teslim ettin!",
            "icon": "🌟",
            "earned": total_submitted >= 1,
            "progress": f"{min(total_submitted, 1)}/1",
            "stars": 1
        },
        {
            "id": "bookworm",
            "title": "Kitap Kurdu",
            "desc": "İlk okuma becerileri metnini ve sorularını tamamladın.",
            "icon": "📖",
            "earned": read_count >= 1,
            "progress": f"{min(read_count, 1)}/1",
            "stars": 2
        },
        {
            "id": "master_reader",
            "title": "Usta Okur",
            "desc": "3 farklı okuma çalışmasını başarıyla bitirdin.",
            "icon": "📚",
            "earned": read_count >= 3,
            "progress": f"{min(read_count, 3)}/3",
            "stars": 3
        },
        {
            "id": "math_explorer",
            "title": "Matematik Kaşifi",
            "desc": "Bir Matematik fasikül çalışmasını tamamladın.",
            "icon": "📐",
            "earned": "Matematik" in courses_completed,
            "progress": "1/1" if "Matematik" in courses_completed else "0/1",
            "stars": 2
        },
        {
            "id": "young_scientist",
            "title": "Genç Bilim İnsanı",
            "desc": "Bir Fen Bilimleri çalışmasını tamamladın.",
            "icon": "🔬",
            "earned": "Fen Bilimleri" in courses_completed,
            "progress": "1/1" if "Fen Bilimleri" in courses_completed else "0/1",
            "stars": 2
        },
        {
            "id": "on_time",
            "title": "Hedefi Tutturan",
            "desc": "Hedef teslim tarihinden önce veya gününde çalışma bitirdin.",
            "icon": "🎯",
            "earned": on_time_count >= 1,
            "progress": f"{min(on_time_count, 1)}/1",
            "stars": 2
        },
        {
            "id": "mistake_hunter",
            "title": "Hata Avcısı",
            "desc": "Hata Defteri'ndeki soruları kavrayıp başarıyla çözdün.",
            "icon": "🛡️",
            "earned": resolved_mistakes >= 1,
            "progress": f"{min(resolved_mistakes, 1)}/1",
            "stars": 2
        },
        {
            "id": "super_focus",
            "title": "Süper Odak",
            "desc": "Toplam 5 veya daha fazla çalışmayı tamamladın.",
            "icon": "🏆",
            "earned": total_submitted >= 5,
            "progress": f"{min(total_submitted, 5)}/5",
            "stars": 3
        },
        {
            "id": "consistent_streak",
            "title": "İstikrarlı Öğrenci",
            "desc": "Farklı 3 günde düzenli çalışma tamamladın.",
            "icon": "🔥",
            "earned": active_days_count >= 3,
            "progress": f"{min(active_days_count, 3)}/3",
            "stars": 3
        },
        {
            "id": "perfect_score",
            "title": "Yıldız Başarı",
            "desc": "Bir testteki tüm soruları eksiksiz doğru yanıtladın.",
            "icon": "💯",
            "earned": perfect_tests >= 1,
            "progress": f"{min(perfect_tests, 1)}/1",
            "stars": 3
        }
    ]

    earned_badges = [b for b in badges if b["earned"]]
    total_stars = sum(b["stars"] for b in earned_badges)

    return {
        "badges": badges,
        "stats": {
            "earnedCount": len(earned_badges),
            "totalCount": len(badges),
            "totalStars": total_stars
        }
    }


class Handler(BaseHTTPRequestHandler):
    server_version = "CioOkul/0.1"

    def log_message(self, fmt, *args):
        print("[%s] %s" % (self.log_date_time_string(), fmt % args))

    def session_token(self):
        cookie = SimpleCookie()
        try:
            cookie.load(self.headers.get("Cookie", ""))
            return cookie["session"].value or None
        except (KeyError, ValueError, CookieError):
            return None

    def role(self):
        token = self.session_token()
        return session_role(token) if token else None

    def client_ip(self):
        # The proxy in front of the server appends the visitor address as the last entry.
        if TRUST_PROXY:
            forwarded = [part.strip() for part in self.headers.get("X-Forwarded-For", "").split(",") if part.strip()]
            if forwarded:
                return forwarded[-1]
        return self.client_address[0]

    def session_cookie(self, token, max_age):
        return (f"session={token}; HttpOnly; SameSite=Strict; Path=/; Max-Age={max_age}"
                + ("; Secure" if COOKIE_SECURE else ""))

    def send_json(self, data, status=200, cookie=None):
        payload = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        if cookie is not None:
            self.send_header("Set-Cookie", cookie)
        self.end_headers()
        self.wfile.write(payload)

    def send_file(self, payload, content_type, filename=None):
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        if filename:
            self.send_header("Content-Disposition", f'attachment; filename="{filename}"')
        self.end_headers()
        self.wfile.write(payload)

    def send_path(self, path, content_type, filename=None):
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(path.stat().st_size))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        if filename:
            self.send_header("Content-Disposition", f'attachment; filename="{filename}"')
        self.end_headers()
        with path.open("rb") as source:
            shutil.copyfileobj(source, self.wfile)

    def send_remote_audio(self, name):
        header = (self.headers.get("Range") or "").strip()
        response = storage.open_range(name, header if re.fullmatch(r"bytes=\d*-\d*", header) else "")
        if response is None:
            return self.send_json({"error": "Ses bulunamadı."}, 404)
        with response:
            self.send_response(response.status)
            self.send_header("Content-Type", "audio/wav")
            for header_name in ("Content-Length", "Content-Range", "Accept-Ranges"):
                if response.headers.get(header_name):
                    self.send_header(header_name, response.headers[header_name])
            self.send_header("Cache-Control", "private, max-age=86400")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.end_headers()
            if response.status in (200, 206):
                shutil.copyfileobj(response, self.wfile, 256 * 1024)

    def send_audio_range(self, path):
        size = path.stat().st_size
        start, end, status = 0, size - 1, HTTPStatus.OK
        header = (self.headers.get("Range") or "").strip()
        match = re.fullmatch(r"bytes=(\d*)-(\d*)", header) if header else None
        if match:
            first, last = match.groups()
            if first:
                start = int(first)
            elif last:
                start = max(0, size - int(last))
            if last:
                end = int(last)
            if not 0 <= start <= end < size:
                self.send_response(HTTPStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
                self.send_header("Content-Range", f"bytes */{size}")
                self.end_headers()
                return
            status = HTTPStatus.PARTIAL_CONTENT
        length = end - start + 1
        self.send_response(status)
        self.send_header("Content-Type", "audio/wav")
        self.send_header("Content-Length", str(length))
        self.send_header("Accept-Ranges", "bytes")
        if status == HTTPStatus.PARTIAL_CONTENT:
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Cache-Control", "private, max-age=86400")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        with path.open("rb") as source:
            source.seek(start)
            remaining = length
            while remaining:
                chunk = source.read(min(1024 * 256, remaining))
                if not chunk:
                    break
                self.wfile.write(chunk)
                remaining -= len(chunk)

    def body(self):
        length = int(self.headers.get("Content-Length", "0"))
        if length > 20_000:
            raise ValueError("İstek çok büyük")
        return json.loads(self.rfile.read(length) or b"{}")

    def require(self, role=None):
        actual = self.role()
        if actual is None:
            self.send_json({"error": "Oturum açmanız gerekiyor."}, 401)
            return False
        if role and actual != role:
            self.send_json({"error": "Bu işlem için yetkiniz yok."}, 403)
            return False
        return True

    def do_GET(self):
        path = urlparse(self.path).path
        try:
            if reading_module.handle(self, "GET", path, None, connect, DB_LOCK, checked_date): return
            if path.startswith("/reading-audio/"):
                if not self.require(): return
                name = path.removeprefix("/reading-audio/")
                if not re.fullmatch(r"R\d{2}\.wav", name):
                    return self.send_json({"error": "Geçersiz ses."}, 400)
                section = int(name[1:3])
                with connect() as db:
                    if self.role() == "parent":
                        allowed = db.execute("SELECT 1 FROM reading_sections WHERE id=?", (section,)).fetchone()
                    else:
                        allowed = db.execute("SELECT 1 FROM reading_assignments WHERE section_id=?", (section,)).fetchone()
                if not allowed:
                    return self.send_json({"error": "Ses bulunamadı."}, 404)
                if storage.IS_REMOTE:
                    return self.send_remote_audio(f"reading_audio/{name}")
                audio = READING_AUDIO / name
                if not audio.is_file():
                    return self.send_json({"error": "Ses bulunamadı."}, 404)
                return self.send_audio_range(audio)
            if path == "/api/state":
                with connect() as db:
                    configured = db.execute("SELECT COUNT(*) FROM users").fetchone()[0] == 2
                    student = db.execute("SELECT name FROM users WHERE role='student'").fetchone()
                return self.send_json({"configured": configured, "role": self.role(), "studentName": student[0] if student else None,
                                       "setupTokenRequired": SETUP_TOKEN_REQUIRED})
            if path == "/api/study/dashboard":
                if not self.require("parent"): return
                with connect() as db:
                    result = study_features.dashboard(db)
                return self.send_json(result)
            if path == "/api/catalog":
                if not self.require("parent"): return
                query = parse_qs(urlparse(self.path).query)
                booklet_id = int(query.get("bookletId", ["0"])[0])
                with connect() as db:
                    booklets = rows(db, """SELECT b.id,b.course,b.title,b.pdf_path,b.source_url,COUNT(q.id) AS count
                        FROM booklets b LEFT JOIN questions q ON q.booklet_id=b.id
                        GROUP BY b.id ORDER BY b.course,b.id""")
                    questions = rows(db, """SELECT q.id,q.booklet_id,q.number,q.page,q.kind,q.stem,q.answer_key,
                        q.verified,q.image_path,f.note AS flag_note
                        FROM questions q LEFT JOIN question_flags f ON f.question_id=q.id
                        WHERE q.booklet_id=? ORDER BY q.number""", (booklet_id,)) if booklet_id else []
                    overrides={(row["booklet_id"],row["test_index"]):row["year_month"]
                               for row in db.execute("SELECT * FROM plan_overrides")}
                for index, booklet in enumerate(booklets):
                    booklets[index] = annotate_booklet(booklet, TEST_SIZE)
                    booklets[index].pop("pdf_path")
                    tests=booklets[index]["suggestedTests"]
                    for test_index,test in enumerate(tests):
                        value=overrides.get((booklet["id"],test_index))
                        test["overridden"]=bool(value)
                        if value:
                            year,month=map(int,value.split("-"))
                            test["yearMonth"]=value
                            test["month"]=f"{MONTHS[month]} {year}"
                    if tests:
                        booklets[index]["suggestedMonths"]=(tests[0]["month"] if
                            tests[0]["month"]==tests[-1]["month"] else
                            f'{tests[0]["month"]} – {tests[-1]["month"]}')
                return self.send_json({"booklets": booklets, "questions": questions,
                                       "schoolYear": SCHOOL_YEAR, "planningSources": SOURCES})
            if path == "/api/catalog/mixed-meta":
                if not self.require("parent"): return
                with connect() as db:
                    booklets = rows(db, "SELECT id, course, title FROM booklets ORDER BY course, id")
                courses = sorted(list({b["course"] for b in booklets}))
                presets = [
                    {"id": "weekend", "name": "Hafta Sonu Genel Tekrar", "desc": "Tüm ana derslerden dengeli 15 soru",
                     "distribution": {"Matematik": 4, "Türkçe": 4, "Fen Bilimleri": 3, "Sosyal Bilgiler": 2, "Din Kültürü ve Ahlak Bilgisi": 2}},
                    {"id": "stem", "name": "Sayısal Karma", "desc": "8 Matematik + 7 Fen Bilimleri",
                     "distribution": {"Matematik": 8, "Fen Bilimleri": 7}},
                    {"id": "verbal", "name": "Sözel Karma", "desc": "6 Türkçe + 5 Sosyal Bilgiler + 4 Din Kültürü",
                     "distribution": {"Türkçe": 6, "Sosyal Bilgiler": 5, "Din Kültürü ve Ahlak Bilgisi": 4}},
                    {"id": "language", "name": "Dil ve İletişim", "desc": "8 Türkçe + 7 İngilizce",
                     "distribution": {"Türkçe": 8, "İngilizce": 7}}
                ]
                return self.send_json({"courses": courses, "booklets": booklets, "presets": presets})
            if path == "/api/catalog/search":
                if not self.require("parent"): return
                query_params = parse_qs(urlparse(self.path).query)
                q = query_params.get("q", [""])[0].strip()
                course = query_params.get("course", [""])[0].strip()
                try:
                    limit = min(max(int(query_params.get("limit", [50])[0]), 1), 100)
                except ValueError:
                    limit = 50
                norm_q = turkish_normalize(q)
                with connect() as db:
                    conditions = [
                        "(q.image_path IS NOT NULL OR q.verified = 1)",
                        "q.id NOT IN (SELECT question_id FROM question_flags)"
                    ]
                    params = []
                    if course and course != "all":
                        conditions.append("b.course = ?")
                        params.append(course)
                    if norm_q:
                        words = [w for w in norm_q.split() if len(w) >= 2]
                        for w in words[:6]:
                            conditions.append("(TR_NORM(q.stem) LIKE ? OR TR_NORM(b.title) LIKE ?)")
                            params.extend([f"%{w}%", f"%{w}%"])
                    where_clause = " AND ".join(conditions)
                    sql = f"""SELECT q.id, q.number, q.page, q.stem, q.image_path, q.answer_key,
                                     b.id AS booklet_id, b.course, b.title AS booklet_title
                              FROM questions q JOIN booklets b ON b.id = q.booklet_id
                              WHERE {where_clause}
                              ORDER BY b.course, b.id, q.number
                              LIMIT ?"""
                    params.append(limit)
                    items = rows(db, sql, params)
                return self.send_json({"questions": items, "count": len(items)})
            if path == "/api/student/mistakes":
                if not self.require(): return
                with connect() as db:
                    test_mistakes = rows(db, """
                        SELECT DISTINCT
                            'test' AS kind,
                            CAST(q.id AS TEXT) AS item_key,
                            q.id AS question_id,
                            q.number,
                            q.stem,
                            q.image_path,
                            q.answer_key,
                            b.course,
                            b.title AS booklet_title,
                            r.grade,
                            COALESCE(r.note, '') AS parent_note,
                            COALESCE(sf.reason, '') AS reason,
                            COALESCE(sf.uncertain, 0) AS uncertain,
                            a.id AS assignment_id,
                            a.title AS assignment_title,
                            a.submitted_at,
                            mr.resolved_at
                        FROM assignments a
                        JOIN assignment_questions aq ON aq.assignment_id = a.id
                        JOIN questions q ON q.id = aq.question_id
                        JOIN booklets b ON b.id = q.booklet_id
                        LEFT JOIN reviews r ON r.assignment_id = a.id AND r.question_id = q.id
                        LEFT JOIN study_reflections sf ON sf.kind = 'test' AND sf.assignment_id = a.id AND sf.item_key = CAST(q.id AS TEXT)
                        LEFT JOIN mistake_resolutions mr ON mr.kind = 'test' AND mr.item_key = CAST(q.id AS TEXT)
                        WHERE a.submitted_at IS NOT NULL
                          AND (r.grade IN ('incorrect', 'partial') OR sf.uncertain = 1)
                        ORDER BY a.submitted_at DESC, a.id DESC, q.id
                    """)
                    reading_mistakes = rows(db, """
                        SELECT DISTINCT
                            'reading' AS kind,
                            (ra.section_id || '_' || rq.number) AS item_key,
                            rq.number AS question_id,
                            rq.number,
                            rq.prompt AS stem,
                            rq.image AS image_path,
                            COALESCE(rq.answer_key, '') AS answer_key,
                            'Okuma Becerileri' AS course,
                            rs.title AS booklet_title,
                            CASE WHEN rv.score = 0 THEN 'incorrect' ELSE 'partial' END AS grade,
                            COALESCE(rv.note, '') AS parent_note,
                            COALESCE(sf.reason, '') AS reason,
                            COALESCE(sf.uncertain, 0) AS uncertain,
                            ra.id AS assignment_id,
                            ra.title AS assignment_title,
                            ra.submitted_at,
                            mr.resolved_at
                        FROM reading_assignments ra
                        JOIN reading_sections rs ON rs.id = ra.section_id
                        JOIN reading_questions rq ON rq.section_id = ra.section_id
                        LEFT JOIN reading_reviews rv ON rv.assignment_id = ra.id AND rv.number = rq.number
                        LEFT JOIN study_reflections sf ON sf.kind = 'reading' AND sf.assignment_id = ra.id AND sf.item_key = (ra.section_id || '_' || rq.number)
                        LEFT JOIN mistake_resolutions mr ON mr.kind = 'reading' AND mr.item_key = (ra.section_id || '_' || rq.number)
                        WHERE ra.submitted_at IS NOT NULL
                          AND ((rv.score IS NOT NULL AND rv.score < rq.max_score) OR sf.uncertain = 1)
                        ORDER BY ra.submitted_at DESC, ra.id DESC, rq.number
                    """)
                    all_mistakes = test_mistakes + reading_mistakes
                    total = len(all_mistakes)
                    resolved = sum(1 for m in all_mistakes if m.get("resolved_at"))
                    pending = total - resolved
                    return self.send_json({
                        "mistakes": all_mistakes,
                        "stats": {"total": total, "pending": pending, "resolved": resolved}
                    })
            if path == "/api/student/badges":
                if not self.require(): return
                with connect() as db:
                    result = calculate_badges(db)
                return self.send_json(result)
            if path == "/api/backup/status":
                if not self.require("parent"): return
                with connect() as db:
                    row=db.execute("SELECT value FROM settings WHERE key='last_backup_at'").fetchone()
                auto_list = sorted([p.name for p in BACKUPS_DIR.glob("cio_okul_*.sqlite3")]) if BACKUPS_DIR.is_dir() else []
                return self.send_json({
                    "lastBackupAt": row[0] if row else None,
                    "autoBackups": auto_list,
                    "autoBackupsCount": len(auto_list)
                })
            if path == "/api/audit/status":
                if not self.require("parent"): return
                file=storage.read("data/soru_denetimi_ozet.json",DATA/"soru_denetimi_ozet.json")
                groups=storage.read("data/ortak_baglam_raporu.json",DATA/"ortak_baglam_raporu.json")
                summary=json.loads(file.decode("utf-8")) if file is not None else None
                context=json.loads(groups.decode("utf-8")) if groups is not None else []
                return self.send_json({"summary":summary,"sharedGroups":len(context),
                    "contextQuestions":sum(len(item["images"]) for item in context),
                    "trimmedPrevious":sum("trimmed_previous" in item for item in context)})
            if path == "/api/audit/report":
                if not self.require("parent"): return
                report=storage.read("data/soru_denetimi.csv",DATA/"soru_denetimi.csv")
                if report is None: return self.send_json({"error":"Denetim raporu bulunamadı."},404)
                return self.send_file(report,"text/csv; charset=utf-8","soru_denetimi.csv")
            if path == "/api/assignments":
                if not self.require(): return
                with connect() as db:
                    assignments = rows(db, """SELECT a.*, COUNT(aq.question_id) AS total,
                    COUNT(r.question_id) AS answered, COUNT(v.question_id) AS reviewed
                    FROM assignments a LEFT JOIN assignment_questions aq ON aq.assignment_id=a.id
                    LEFT JOIN responses r ON r.assignment_id=aq.assignment_id AND r.question_id=aq.question_id
                    LEFT JOIN reviews v ON v.assignment_id=aq.assignment_id AND v.question_id=aq.question_id
                    GROUP BY a.id ORDER BY a.id DESC""")
                return self.send_json({"assignments": assignments})
            if path == "/api/progress":
                if not self.require("parent"): return
                with connect() as db:
                    by_course = rows(db, """SELECT b.course,
                        COUNT(v.question_id) AS reviewed,
                        SUM(CASE WHEN v.grade='correct' THEN 1 ELSE 0 END) AS correct,
                        SUM(CASE WHEN v.grade='incorrect' THEN 1 ELSE 0 END) AS incorrect,
                        SUM(CASE WHEN v.grade='partial' THEN 1 ELSE 0 END) AS partial
                        FROM reviews v JOIN questions q ON q.id=v.question_id
                        JOIN booklets b ON b.id=q.booklet_id GROUP BY b.course ORDER BY b.course""")
                    by_booklet = rows(db, """SELECT b.course,b.title,b.id AS booklet_id,
                        COUNT(v.question_id) AS reviewed,
                        SUM(CASE WHEN v.grade='correct' THEN 1 ELSE 0 END) AS correct,
                        SUM(CASE WHEN v.grade='incorrect' THEN 1 ELSE 0 END) AS incorrect,
                        SUM(CASE WHEN v.grade='partial' THEN 1 ELSE 0 END) AS partial
                        FROM reviews v JOIN questions q ON q.id=v.question_id
                        JOIN booklets b ON b.id=q.booklet_id GROUP BY b.id ORDER BY b.course,b.id""")
                    trend = rows(db, """SELECT substr(a.submitted_at,1,7) AS month,
                        COUNT(v.question_id) AS reviewed,
                        SUM(CASE WHEN v.grade='correct' THEN 1 ELSE 0 END) AS correct
                        FROM reviews v JOIN assignments a ON a.id=v.assignment_id
                        GROUP BY substr(a.submitted_at,1,7) ORDER BY month""")
                    wrong = rows(db, """WITH latest AS (
                        SELECT q.id,q.number,b.id AS booklet_id,b.course,b.title AS booklet_title,v.grade,
                        ROW_NUMBER() OVER(PARTITION BY q.id ORDER BY a.submitted_at DESC,a.id DESC) AS rn
                        FROM reviews v JOIN assignments a ON a.id=v.assignment_id
                        JOIN questions q ON q.id=v.question_id JOIN booklets b ON b.id=q.booklet_id)
                        SELECT id,number,booklet_id,course,booklet_title,grade FROM latest
                        WHERE rn=1 AND grade IN ('incorrect','partial')
                        ORDER BY course,booklet_title,number""")
                    reviewed_ids={row[0] for row in db.execute("SELECT DISTINCT question_id FROM reviews")}
                    weak_units=[]
                    ranked=sorted(
                        (unit for unit in by_booklet if unit["incorrect"]+unit["partial"]>0),
                        key=lambda unit: (-(unit["incorrect"]+unit["partial"])/unit["reviewed"],
                                          -(unit["incorrect"]+unit["partial"]),unit["course"]))
                    for unit in ranked[:6]:
                        selected=[{"id":q["id"],"number":q["number"],"reason":"Yanlış veya kısmen doğru"}
                                  for q in wrong if q["booklet_id"]==unit["booklet_id"]]
                        selected=selected[:TEST_SIZE]
                        selected_ids={q["id"] for q in selected}
                        for question in db.execute("""SELECT id,number FROM questions
                                WHERE booklet_id=? ORDER BY number""",(unit["booklet_id"],)):
                            if len(selected)>=TEST_SIZE: break
                            if question["id"] not in reviewed_ids and question["id"] not in selected_ids:
                                selected.append({"id":question["id"],"number":question["number"],
                                                 "reason":"Henüz çözülmedi"})
                        weak_units.append({**unit,"questions":selected})
                return self.send_json({"byCourse":by_course,"byBooklet":by_booklet,
                                       "trend":trend,"wrongQuestions":wrong,
                                       "weakUnits":weak_units})
            if path == "/api/backup":
                if not self.require("parent"): return
                if database.IS_POSTGRES:
                    with DB_LOCK, connect() as db:
                        payload = json.dumps(data_export.export_tables(db), ensure_ascii=False).encode("utf-8")
                        db.execute("""INSERT INTO settings(key,value) VALUES ('last_backup_at',CURRENT_TIMESTAMP)
                            ON CONFLICT(key) DO UPDATE SET value=CURRENT_TIMESTAMP""")
                    buffer = BytesIO()
                    with zipfile.ZipFile(buffer, "w", compression=zipfile.ZIP_DEFLATED) as archive:
                        archive.writestr(BACKUP_JSON, payload)
                    return self.send_file(buffer.getvalue(), "application/zip", BACKUP_NAME)
                DATA.mkdir(exist_ok=True)
                with tempfile.TemporaryDirectory(dir=DATA) as temporary:
                    directory = Path(temporary)
                    snapshot = directory / "database.sqlite3"
                    with DB_LOCK, closing(connect()) as source, closing(sqlite3.connect(snapshot)) as destination:
                        source.backup(destination)
                    archive_path = directory / BACKUP_NAME
                    with zipfile.ZipFile(archive_path, "w", compression=zipfile.ZIP_STORED,
                                         allowZip64=True) as archive:
                        archive.write(snapshot, "cio_okul.sqlite3")
                        for image in sorted(QUESTION_IMAGES.glob("*.png")):
                            if re.fullmatch(r"[A-Z0-9_]+\.png", image.name):
                                archive.write(image, f"question_images/{image.name}")
                        for image in sorted(reading_module.IMAGES.glob("*.png")):
                            if re.fullmatch(r"R\d{2}_[PQA]\d{2}\.png", image.name):
                                archive.write(image, f"reading_images/{image.name}")
                    # Recorded before sending, so a status request right after the download sees it.
                    with DB_LOCK, connect() as db:
                        db.execute("""INSERT INTO settings(key,value) VALUES ('last_backup_at',CURRENT_TIMESTAMP)
                            ON CONFLICT(key) DO UPDATE SET value=CURRENT_TIMESTAMP""")
                    self.send_path(archive_path, "application/zip", BACKUP_NAME)
                    return
            if path.startswith("/api/questions/") and path.endswith("/page"):
                if not self.require("parent"): return
                question_id = int(path.strip("/").split("/")[2])
                with connect() as db:
                    question = db.execute("SELECT booklet_id,page FROM questions WHERE id=?", (question_id,)).fetchone()
                    if not question: return self.send_json({"error":"Soru bulunamadı."},404)
                    pdf_path = pdf_for_booklet(db, question["booklet_id"])
                page_image = render_page(pdf_path, question["page"])
                buffer = BytesIO()
                page_image.save(buffer, format="PNG", optimize=True)
                return self.send_file(buffer.getvalue(), "image/png")
            if path.startswith("/api/assignments/"):
                if not self.require(): return
                assignment_id = int(path.rsplit("/", 1)[1])
                with connect() as db:
                    assignment = db.execute("SELECT * FROM assignments WHERE id=?", (assignment_id,)).fetchone()
                    if not assignment: return self.send_json({"error": "Çalışma bulunamadı."}, 404)
                    questions = rows(db, """SELECT q.id,q.number,q.page,q.kind,q.stem,q.booklet_id,q.answer_key,q.image_path,
                        b.course,b.title AS booklet_title,
                        r.choice AS response,COALESCE(r.duration_seconds, 0) AS duration_seconds,v.grade,v.note,f.note AS flag_note,
                        COALESCE(sf.uncertain,0) AS uncertain,COALESCE(sf.reason,'') AS reason
                        FROM assignment_questions aq JOIN questions q ON q.id=aq.question_id
                        JOIN booklets b ON b.id=q.booklet_id
                        LEFT JOIN responses r ON r.assignment_id=aq.assignment_id AND r.question_id=q.id
                        LEFT JOIN reviews v ON v.assignment_id=aq.assignment_id AND v.question_id=q.id
                        LEFT JOIN question_flags f ON f.question_id=q.id
                        LEFT JOIN study_reflections sf ON sf.kind='test' AND sf.assignment_id=aq.assignment_id AND sf.item_key=CAST(q.id AS TEXT)
                        WHERE aq.assignment_id=? ORDER BY aq.position""", (assignment_id,))
                    feedback_ready = bool(assignment["submitted_at"]) and bool(questions) and all(
                        question["grade"] for question in questions)
                    for question in questions:
                        question["choices"] = rows(db, "SELECT label,text FROM choices WHERE question_id=? ORDER BY label", (question["id"],))
                        if self.role() != "parent":
                            question.pop("reason")
                            if not feedback_ready:
                                question.pop("answer_key")
                                question.pop("grade")
                                question.pop("note")
                            question.pop("flag_note")
                return self.send_json({"assignment": dict(assignment), "questions": questions,
                                       "feedbackReady": feedback_ready})
            if path == "/api/source-pdf":
                if not self.require("parent"): return
                booklet_id = int(parse_qs(urlparse(self.path).query).get("bookletId", ["1"])[0])
                with connect() as db:
                    try: pdf_file = pdf_for_booklet(db, booklet_id)
                    except ValueError as exc: return self.send_json({"error": str(exc)},404)
                payload = pdf_file.read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", "application/pdf")
                self.send_header("Content-Length", str(len(payload)))
                self.send_header("Cache-Control", "private")
                self.end_headers()
                return self.wfile.write(payload)
            if path.startswith("/question-images/"):
                if not self.require(): return
                filename = path.removeprefix("/question-images/")
                if not re.fullmatch(r"[A-Z0-9_]+\.png", filename):
                    return self.send_json({"error": "Geçersiz görsel adı."}, 400)
                with connect() as db:
                    if self.role() == "parent":
                        allowed = db.execute("SELECT 1 FROM questions WHERE image_path=?", (filename,)).fetchone()
                    else:
                        allowed = db.execute("""SELECT 1 FROM questions q
                            JOIN assignment_questions aq ON aq.question_id=q.id
                            WHERE q.image_path=? LIMIT 1""", (filename,)).fetchone()
                if not allowed: return self.send_json({"error": "Görsel bulunamadı."}, 404)
                payload = storage.read(f"question_images/{filename}", QUESTION_IMAGES / filename)
                if payload is None: return self.send_json({"error": "Görsel dosyası bulunamadı."}, 404)
                self.send_response(200)
                self.send_header("Content-Type", "image/png")
                self.send_header("Content-Length", str(len(payload)))
                self.send_header("X-Content-Type-Options", "nosniff")
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                return self.wfile.write(payload)
            return self.serve_static(path)
        except (ValueError, *database.ERRORS) as exc:
            return self.send_json({"error": str(exc)}, 400)

    def serve_static(self, path):
        path = "/index.html" if path == "/" else path
        candidate = (WEB / path.lstrip("/")).resolve()
        if not candidate.is_relative_to(WEB.resolve()) or not candidate.is_file():
            return self.send_json({"error": "Bulunamadı."}, 404)
        payload = candidate.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", mimetypes.guess_type(candidate.name)[0] or "application/octet-stream")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)

    def do_POST(self):
        path = urlparse(self.path).path
        try:
            if path == "/api/backup/restore":
                if not self.require("parent"): return
                length = int(self.headers.get("Content-Length", "0"))
                if length < 100 or length > 2_000_000_000:
                    raise ValueError("Yedek dosyasının boyutu geçersiz.")
                if not database.IS_POSTGRES:
                    DATA.mkdir(exist_ok=True)
                upload_dir = None if database.IS_POSTGRES else DATA
                with tempfile.NamedTemporaryFile(dir=upload_dir, suffix=".zip", delete=False) as target:
                    temporary = Path(target.name)
                    remaining = length
                    while remaining:
                        chunk = self.rfile.read(min(1024 * 1024, remaining))
                        if not chunk:
                            raise ValueError("Yedek yüklemesi tamamlanamadı.")
                        target.write(chunk)
                        remaining -= len(chunk)
                try:
                    if database.IS_POSTGRES:
                        counts, images = restore_postgres_backup(temporary)
                        return self.send_json({"ok": True, "restartRequired": False,
                                               "restoredRows": sum(counts.values()), "imagesSkipped": images})
                    validate_backup(temporary)
                    os.replace(temporary, DATA / "pending_restore.zip")
                finally:
                    temporary.unlink(missing_ok=True)
                return self.send_json({"ok":True,"restartRequired":True})
            data = self.body()
            if reading_module.handle(self, "POST", path, data, connect, DB_LOCK, checked_date):
                if path.endswith("/reviews") or path.endswith("/submit"):
                    create_auto_backup()
                return
            if path == "/api/setup":
                # On a reachable server the first visitor must not become the parent: setup needs SETUP_TOKEN.
                if SETUP_TOKEN_REQUIRED:
                    keys = [f"ip:{self.client_ip()}"]
                    if login_blocked(keys):
                        return self.send_json({"error": "Çok fazla hatalı deneme. 15 dakika sonra tekrar deneyin."}, 429)
                    if not SETUP_TOKEN or not hmac.compare_digest(str(data.get("setupToken", "")), SETUP_TOKEN):
                        record_login_failure(keys)
                        return self.send_json({"error": "Kurulum anahtarı yanlış veya sunucuda tanımlı değil."}, 403)
                parent_password = str(data.get("parentPassword", ""))
                student_pin = str(data.get("studentPin", ""))
                student_name = str(data.get("studentName", "")).strip()
                if len(parent_password) < 8 or not (student_pin.isdigit() and len(student_pin) >= 4) or not student_name:
                    raise ValueError("Veli şifresi en az 8 karakter, öğrenci PIN'i en az 4 rakam olmalı.")
                with DB_LOCK, connect() as db:
                    if db.execute("SELECT COUNT(*) FROM users").fetchone()[0]:
                        return self.send_json({"error": "Kurulum zaten yapılmış."}, 409)
                    for role, name, secret in [("parent", "Veli", parent_password), ("student", student_name, student_pin)]:
                        salt = secrets.token_hex(16)
                        db.execute("INSERT INTO users VALUES (?,?,?,?)", (role, name, salt, hash_secret(secret, salt)))
                return self.send_json({"ok": True})
            if path == "/api/login":
                role = data.get("role")
                if role not in ("parent", "student"):
                    return self.send_json({"error": "Giriş bilgisi yanlış."}, 401)
                keys = [f"ip:{self.client_ip()}", f"role:{role}"]
                if login_blocked(keys):
                    return self.send_json({"error": "Çok fazla hatalı deneme. 15 dakika sonra tekrar deneyin."}, 429)
                with connect() as db:
                    user = db.execute("SELECT * FROM users WHERE role=?", (role,)).fetchone()
                if not user or not hmac.compare_digest(user["secret_hash"], hash_secret(str(data.get("secret", "")), user["salt"])):
                    record_login_failure(keys)
                    return self.send_json({"error": "Giriş bilgisi yanlış."}, 401)
                token = create_session(role)
                return self.send_json({"role": role, "name": user["name"]}, cookie=self.session_cookie(token, SESSION_SECONDS))
            if path == "/api/logout":
                cookie = SimpleCookie()
                try:
                    cookie.load(self.headers.get("Cookie", ""))
                except CookieError:
                    pass
                if "session" in cookie: end_session(cookie["session"].value)
                return self.send_json({"ok": True}, cookie=self.session_cookie("", 0))
            if path in ("/api/account/password", "/api/account/student", "/api/account/sessions/end"):
                if not self.require("parent"): return
                keys = [f"ip:{self.client_ip()}", "role:parent"]
                if login_blocked(keys):
                    return self.send_json({"error": "Çok fazla hatalı deneme. 15 dakika sonra tekrar deneyin."}, 429)
                with connect() as db:
                    parent = db.execute("SELECT salt, secret_hash FROM users WHERE role='parent'").fetchone()
                if not parent or not hmac.compare_digest(
                        parent["secret_hash"], hash_secret(str(data.get("currentPassword", "")), parent["salt"])):
                    record_login_failure(keys)
                    return self.send_json({"error": "Mevcut veli şifresi yanlış."}, 403)
                token = self.session_token()
                if path == "/api/account/password":
                    new_password = str(data.get("newPassword", ""))
                    if len(new_password) < 8:
                        raise ValueError("Yeni veli şifresi en az 8 karakter olmalı.")
                    salt = secrets.token_hex(16)
                    with DB_LOCK, connect() as db:
                        db.execute("UPDATE users SET salt=?, secret_hash=? WHERE role='parent'",
                                   (salt, hash_secret(new_password, salt)))
                    return self.send_json({"ok": True, "endedSessions": end_other_sessions(token, "parent")})
                if path == "/api/account/student":
                    new_pin = str(data.get("newPin", ""))
                    student_name = str(data.get("studentName", "")).strip()
                    if new_pin and not (new_pin.isdigit() and len(new_pin) >= 4):
                        raise ValueError("Öğrenci PIN'i en az 4 rakam olmalı.")
                    if len(student_name) > 50:
                        raise ValueError("Öğrencinin adı en fazla 50 karakter olabilir.")
                    if not new_pin and not student_name:
                        raise ValueError("Değişiklik belirtilmedi.")
                    with DB_LOCK, connect() as db:
                        if student_name:
                            db.execute("UPDATE users SET name=? WHERE role='student'", (student_name,))
                        if new_pin:
                            salt = secrets.token_hex(16)
                            db.execute("UPDATE users SET salt=?, secret_hash=? WHERE role='student'",
                                       (salt, hash_secret(new_pin, salt)))
                    ended = end_other_sessions(token, "student") if new_pin else 0
                    return self.send_json({"ok": True, "endedSessions": ended})
                return self.send_json({"ok": True, "endedSessions": end_other_sessions(token)})
            if path == "/api/student/mistakes/resolve":
                if not self.require(): return
                kind = str(data.get("kind", ""))
                item_key = str(data.get("itemKey", ""))
                resolved = bool(data.get("resolved"))
                if kind not in ("test", "reading") or not item_key:
                    raise ValueError("Geçersiz parametre.")
                with DB_LOCK, connect() as db:
                    if resolved:
                        db.execute("""INSERT INTO mistake_resolutions(kind, item_key, resolved_at)
                                      VALUES (?, ?, CURRENT_TIMESTAMP)
                                      ON CONFLICT(kind, item_key) DO UPDATE SET resolved_at=CURRENT_TIMESTAMP""",
                                   (kind, item_key))
                    else:
                        db.execute("DELETE FROM mistake_resolutions WHERE kind=? AND item_key=?", (kind, item_key))
                return self.send_json({"ok": True, "resolved": resolved})
            if path == "/api/catalog/mixed-generate":
                if not self.require("parent"): return
                dist = data.get("distribution") or {}
                booklet_ids = data.get("bookletIds")
                if not isinstance(dist, dict):
                    raise ValueError("Ders dağılımı geçersiz.")
                total_requested = sum(int(v) for v in dist.values() if isinstance(v, (int, float)))
                if total_requested <= 0 or total_requested > TEST_SIZE:
                    raise ValueError(f"En fazla {TEST_SIZE} soru seçebilirsiniz.")
                chosen = []
                with connect() as db:
                    for course, cnt in dist.items():
                        cnt = int(cnt)
                        if cnt <= 0: continue
                        if booklet_ids and isinstance(booklet_ids, list) and booklet_ids:
                            sql = """SELECT q.id, q.number, q.page, q.stem, q.image_path, q.answer_key,
                                            b.id AS booklet_id, b.course, b.title AS booklet_title
                                     FROM questions q JOIN booklets b ON b.id = q.booklet_id
                                     WHERE b.course = ? AND b.id IN ({seq})
                                       AND q.image_path IS NOT NULL
                                       AND q.id NOT IN (SELECT question_id FROM question_flags)
                                     ORDER BY RANDOM() LIMIT ?""".format(
                                         seq=",".join("?" * len(booklet_ids)))
                            params = (course, *booklet_ids, cnt)
                        else:
                            sql = """SELECT q.id, q.number, q.page, q.stem, q.image_path, q.answer_key,
                                            b.id AS booklet_id, b.course, b.title AS booklet_title
                                     FROM questions q JOIN booklets b ON b.id = q.booklet_id
                                     WHERE b.course = ?
                                       AND q.image_path IS NOT NULL
                                       AND q.id NOT IN (SELECT question_id FROM question_flags)
                                     ORDER BY RANDOM() LIMIT ?"""
                            params = (course, cnt)
                        items = rows(db, sql, params)
                        chosen.extend(items)
                return self.send_json({"questions": chosen[:TEST_SIZE]})
            if path == "/api/assignments":
                if not self.require("parent"): return
                title = str(data.get("title", "")).strip()
                ids = data.get("questionIds")
                due_date = checked_date(data.get("dueDate"))
                if not title or len(title) > 100 or not isinstance(ids, list) or not ids or len(ids) > TEST_SIZE or len(set(ids)) != len(ids):
                    raise ValueError(f"Bir çalışma için başlık ve en fazla {TEST_SIZE} soru seçin.")
                with DB_LOCK, connect() as db:
                    valid = {r[0] for r in db.execute("SELECT id FROM questions WHERE image_path IS NOT NULL OR verified=1")}
                    if not all(isinstance(q, int) and q in valid for q in ids):
                        raise ValueError("Geçersiz soru seçimi.")
                    new_id = db.execute("INSERT INTO assignments(title,due_date) VALUES (?,?) RETURNING id",
                                        (title,due_date)).fetchone()[0]
                    db.executemany("INSERT INTO assignment_questions VALUES (?,?,?)", [(new_id, q, i) for i, q in enumerate(ids)])
                    if data.get("fromRepeatQueue") is True:
                        study_features.mark_dispatched(db, "test", new_id, [str(q) for q in ids])
                return self.send_json({"id": new_id}, 201)
            parts = path.strip("/").split("/")
            if len(parts) == 4 and parts[:2] == ["api", "assignments"] and parts[3] == "submit":
                if not self.require("student"): return
                aid = int(parts[2])
                with DB_LOCK, connect() as db:
                    a = db.execute("SELECT submitted_at FROM assignments WHERE id=?", (aid,)).fetchone()
                    if not a: return self.send_json({"error": "Çalışma bulunamadı."}, 404)
                    if a[0]: return self.send_json({"error": "Çalışma zaten teslim edildi."}, 409)
                    total = db.execute("SELECT COUNT(*) FROM assignment_questions WHERE assignment_id=?", (aid,)).fetchone()[0]
                    answered = db.execute("SELECT COUNT(*) FROM responses WHERE assignment_id=?", (aid,)).fetchone()[0]
                    if answered != total: raise ValueError("Teslim etmeden önce tüm soruları yanıtlayın.")
                    db.execute("UPDATE assignments SET submitted_at=CURRENT_TIMESTAMP WHERE id=?", (aid,))
                create_auto_backup()
                return self.send_json({"ok": True})
            if len(parts) == 4 and parts[:2] == ["api", "assignments"] and parts[3] == "reviews":
                if not self.require("parent"): return
                aid = int(parts[2])
                reviews = data.get("reviews")
                if not isinstance(reviews, list) or not reviews or len(reviews) > 200:
                    raise ValueError("Değerlendirilecek sorular eksik.")
                with DB_LOCK, connect() as db:
                    assignment = db.execute("SELECT submitted_at FROM assignments WHERE id=?", (aid,)).fetchone()
                    if not assignment: return self.send_json({"error": "Çalışma bulunamadı."}, 404)
                    if not assignment[0]: raise ValueError("Öğrenci çalışmayı henüz teslim etmedi.")
                    expected = {row[0] for row in db.execute(
                        "SELECT question_id FROM assignment_questions WHERE assignment_id=?", (aid,))}
                    received = [item.get("questionId") for item in reviews if isinstance(item, dict)]
                    if (len(received) != len(reviews) or
                            not all(isinstance(q, int) for q in received) or
                            len(received) != len(expected) or set(received) != expected):
                        raise ValueError("Tüm sorular tam olarak bir kez değerlendirilmelidir.")
                    for item in reviews:
                        grade, note = item.get("grade"), item.get("note", "")
                        if grade not in ("correct", "incorrect", "partial") or not isinstance(note, str) or len(note) > 500:
                            raise ValueError("Geçersiz değerlendirme veya not.")
                        if item.get("reason", "") not in study_features.REASONS:
                            raise ValueError("Zorlanma nedeni geçersiz.")
                    previous = {r["question_id"]: r["grade"] for r in db.execute(
                        "SELECT question_id,grade FROM reviews WHERE assignment_id=?", (aid,))}
                    db.executemany("""INSERT INTO reviews VALUES (?,?,?,?,CURRENT_TIMESTAMP)
                        ON CONFLICT(assignment_id,question_id) DO UPDATE SET
                        grade=excluded.grade,note=excluded.note,reviewed_at=CURRENT_TIMESTAMP
                        WHERE reviews.grade<>excluded.grade OR reviews.note<>excluded.note""",
                        [(aid, item["questionId"], item["grade"], item.get("note", "").strip()) for item in reviews])
                    for item in reviews:
                        key = study_features.item_key("test", item["questionId"])
                        study_features.set_reason(db, "test", aid, key, item.get("reason", ""))
                        if previous.get(item["questionId"]) != item["grade"]:
                            study_features.record_review(db, "test", aid, key, item["grade"] == "correct")
                create_auto_backup()
                return self.send_json({"ok": True, "saved": len(reviews)})
            raise ValueError("Bilinmeyen işlem.")
        except (ValueError, TypeError, zipfile.BadZipFile, *database.ERRORS) as exc:
            return self.send_json({"error": str(exc)}, 400)

    def do_PUT(self):
        try:
            data = self.body()
            path = urlparse(self.path).path
            if reading_module.handle(self, "PUT", path, data, connect, DB_LOCK, checked_date): return
            parts = urlparse(self.path).path.strip("/").split("/")
            if len(parts) == 6 and parts[:3] == ["api", "study", "reflections"]:
                if not self.require("student"): return
                kind, aid, key = parts[3], int(parts[4]), parts[5]
                if kind not in ("test", "reading"): raise ValueError("Çalışma türü geçersiz.")
                with DB_LOCK, connect() as db:
                    if kind == "test":
                        row = db.execute("""SELECT a.submitted_at FROM assignments a JOIN assignment_questions aq
                            ON aq.assignment_id=a.id WHERE a.id=? AND aq.question_id=?""", (aid, int(key))).fetchone()
                    else:
                        section, number = map(int, key.split(":"))
                        a = db.execute("SELECT * FROM reading_assignments WHERE id=? AND section_id=?", (aid, section)).fetchone()
                        row = a if a and number in reading_module.assigned_numbers(db, a) else None
                    if not row: raise ValueError("Soru bu çalışmaya ait değil.")
                    if row["submitted_at"]: raise ValueError("Teslim edilen çalışmanın eminlik seçimi değiştirilemez.")
                    study_features.set_uncertain(db, kind, aid, key, data.get("uncertain"))
                return self.send_json({"ok": True})
            if parts==["api","plan-overrides"]:
                if not self.require("parent"): return
                booklet_id,index=data.get("bookletId"),data.get("testIndex")
                value=data.get("yearMonth")
                if (not isinstance(booklet_id,int) or isinstance(booklet_id,bool) or
                    not isinstance(index,int) or isinstance(index,bool) or index<0):
                    raise ValueError("Fasikül veya test geçersiz.")
                if value not in (None,""):
                    if not isinstance(value,str) or not re.fullmatch(r"20\d{2}-(0[1-9]|1[0-2])",value):
                        raise ValueError("Ay YYYY-AA biçiminde olmalı.")
                    if not 2025<=int(value[:4])<=2031:
                        raise ValueError("Planlanan yıl geçersiz.")
                with DB_LOCK,connect() as db:
                    count=db.execute("SELECT COUNT(*) FROM questions WHERE booklet_id=?",(booklet_id,)).fetchone()[0]
                    if index>=(count+TEST_SIZE-1)//TEST_SIZE:
                        raise ValueError("Test bulunamadı.")
                    if value:
                        db.execute("""INSERT INTO plan_overrides VALUES (?,?,?)
                            ON CONFLICT(booklet_id,test_index) DO UPDATE SET year_month=excluded.year_month""",
                            (booklet_id,index,value))
                    else:
                        db.execute("DELETE FROM plan_overrides WHERE booklet_id=? AND test_index=?",
                                   (booklet_id,index))
                return self.send_json({"ok":True})
            if len(parts) == 4 and parts[:2] == ["api", "questions"]:
                if not self.require("parent"): return
                qid, action = int(parts[2]), parts[3]
                with DB_LOCK, connect() as db:
                    q = db.execute("SELECT id,booklet_id,page,image_path FROM questions WHERE id=?", (qid,)).fetchone()
                    if not q: return self.send_json({"error":"Soru bulunamadı."},404)
                    if action == "flag":
                        note = str(data.get("note","")).strip()
                        if len(note) > 500: raise ValueError("Görsel notu çok uzun.")
                        if note:
                            db.execute("""INSERT INTO question_flags(question_id,note) VALUES (?,?)
                                ON CONFLICT(question_id) DO UPDATE SET note=excluded.note,
                                created_at=CURRENT_TIMESTAMP""",(qid,note))
                        else:
                            db.execute("DELETE FROM question_flags WHERE question_id=?",(qid,))
                    elif action == "verify":
                        db.execute("UPDATE questions SET verified=1 WHERE id=?",(qid,))
                        db.execute("DELETE FROM question_flags WHERE question_id=?",(qid,))
                    elif action == "crop":
                        coordinates = data.get("box")
                        if (not isinstance(coordinates,list) or len(coordinates)!=4 or
                                not all(isinstance(v,(int,float)) and not isinstance(v,bool) for v in coordinates)):
                            raise ValueError("Kesim alanı geçersiz.")
                        left,top,right,bottom = coordinates
                        if not (0 <= left < right <= 1 and 0 <= top < bottom <= 1 and
                                right-left >= .02 and bottom-top >= .02):
                            raise ValueError("Kesim alanı çok küçük veya geçersiz.")
                        pdf = pdf_for_booklet(db,q["booklet_id"])
                        page = render_page(pdf,q["page"],scale=2)
                        box = (round(left*page.width),round(top*page.height),
                               round(right*page.width),round(bottom*page.height))
                        crop = page.crop(box)
                        filename = q["image_path"]
                        if not filename or not re.fullmatch(r"[A-Z0-9_]+\.png",filename):
                            raise ValueError("Görsel dosyası geçersiz.")
                        buffer = BytesIO()
                        crop.save(buffer,format="PNG",optimize=True)
                        storage.write(f"question_images/{filename}",QUESTION_IMAGES / filename,buffer.getvalue())
                        db.execute("UPDATE questions SET verified=1 WHERE id=?",(qid,))
                        db.execute("DELETE FROM question_flags WHERE question_id=?",(qid,))
                    else:
                        raise ValueError("Bilinmeyen işlem.")
                return self.send_json({"ok":True})
            if len(parts) == 4 and parts[:2] == ["api", "assignments"] and parts[3] == "progress":
                if not self.require("student"): return
                aid = int(parts[2])
                index = data.get("index")
                if not isinstance(index,int) or isinstance(index,bool) or index < 0:
                    raise ValueError("Soru sırası geçersiz.")
                with DB_LOCK, connect() as db:
                    assignment = db.execute("SELECT submitted_at FROM assignments WHERE id=?",(aid,)).fetchone()
                    if not assignment: return self.send_json({"error":"Çalışma bulunamadı."},404)
                    if assignment[0]: return self.send_json({"error":"Çalışma teslim edildi."},409)
                    total = db.execute("SELECT COUNT(*) FROM assignment_questions WHERE assignment_id=?",(aid,)).fetchone()[0]
                    if index >= total: raise ValueError("Soru sırası geçersiz.")
                    db.execute("UPDATE assignments SET last_question_index=? WHERE id=?",(index,aid))
                return self.send_json({"ok":True})
            if len(parts) == 3 and parts[:2] == ["api", "assignments"]:
                if not self.require("parent"): return
                aid = int(parts[2])
                title = data.get("title")
                if title is not None:
                    title = str(title).strip()
                    if not title or len(title) > 100:
                        raise ValueError("Çalışma adı 1–100 karakter olmalı.")
                due_date = checked_date(data.get("dueDate")) if "dueDate" in data else None
                if title is None and "dueDate" not in data:
                    raise ValueError("Değişiklik belirtilmedi.")
                with DB_LOCK, connect() as db:
                    updated = db.execute("""UPDATE assignments SET title=COALESCE(?,title),
                        due_date=CASE WHEN ?=1 THEN ? ELSE due_date END WHERE id=?""",
                        (title,int("dueDate" in data),due_date,aid))
                    if not updated.rowcount:
                        return self.send_json({"error": "Çalışma bulunamadı."}, 404)
                return self.send_json({"ok": True, "title": title, "dueDate":due_date})
            if len(parts) != 5 or parts[:2] != ["api", "assignments"]:
                raise ValueError("Bilinmeyen işlem.")
            aid, action, qid = int(parts[2]), parts[3], int(parts[4])
            with DB_LOCK, connect() as db:
                assigned = db.execute("""SELECT q.kind FROM assignment_questions aq
                    JOIN questions q ON q.id=aq.question_id WHERE aq.assignment_id=? AND aq.question_id=?""", (aid, qid)).fetchone()
                if not assigned: return self.send_json({"error": "Soru bu çalışmada yok."}, 404)
                if action == "answers":
                    if not self.require("student"): return
                    if db.execute("SELECT submitted_at FROM assignments WHERE id=?", (aid,)).fetchone()[0]:
                        return self.send_json({"error": "Teslim edilmiş çalışma değiştirilemez."}, 409)
                    if assigned["kind"] == "written":
                        choice = str(data.get("text", "")).strip()
                        if not choice or len(choice) > 4000:
                            raise ValueError("Yanıt 1–4000 karakter olmalı.")
                    else:
                        choice = data.get("choice")
                        if choice not in ("A", "B", "C", "D"):
                            raise ValueError("Geçersiz şık.")
                    duration = max(int(data.get("durationSeconds", 0)), 0)
                    db.execute("""INSERT INTO responses(assignment_id,question_id,choice,duration_seconds,updated_at)
                        VALUES (?,?,?,?,CURRENT_TIMESTAMP)
                        ON CONFLICT(assignment_id,question_id) DO UPDATE SET
                        choice=excluded.choice,
                        duration_seconds=responses.duration_seconds + excluded.duration_seconds,
                        updated_at=CURRENT_TIMESTAMP""", (aid, qid, choice, duration))
                elif action == "reviews":
                    if not self.require("parent"): return
                    if not db.execute("SELECT submitted_at FROM assignments WHERE id=?", (aid,)).fetchone()[0]:
                        raise ValueError("Öğrenci çalışmayı henüz teslim etmedi.")
                    grade, note = data.get("grade"), str(data.get("note", "")).strip()
                    if grade not in ("correct", "incorrect", "partial") or len(note) > 500:
                        raise ValueError("Geçersiz değerlendirme.")
                    old = db.execute("SELECT grade FROM reviews WHERE assignment_id=? AND question_id=?", (aid,qid)).fetchone()
                    db.execute("INSERT INTO reviews VALUES (?,?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(assignment_id,question_id) DO UPDATE SET grade=excluded.grade,note=excluded.note,reviewed_at=CURRENT_TIMESTAMP", (aid, qid, grade, note))
                    key = study_features.item_key("test", qid)
                    study_features.set_reason(db, "test", aid, key, data.get("reason", ""))
                    if not old or old["grade"] != grade:
                        study_features.record_review(db, "test", aid, key, grade == "correct")
                    create_auto_backup()
                else:
                    raise ValueError("Bilinmeyen işlem.")
            return self.send_json({"ok": True})
        except (ValueError, TypeError, *database.ERRORS) as exc:
            return self.send_json({"error": str(exc)}, 400)

    def do_DELETE(self):
        try:
            path = urlparse(self.path).path
            if reading_module.handle(self, "DELETE", path, None, connect, DB_LOCK, checked_date): return
            parts = urlparse(self.path).path.strip("/").split("/")
            if len(parts)==5 and parts[:2]==["api","assignments"] and parts[3]=="answers":
                if not self.require("student"): return
                aid,qid=int(parts[2]),int(parts[4])
                with DB_LOCK,connect() as db:
                    assignment=db.execute("SELECT submitted_at FROM assignments WHERE id=?",(aid,)).fetchone()
                    if not assignment: return self.send_json({"error":"Çalışma bulunamadı."},404)
                    if assignment[0]: return self.send_json({"error":"Teslim edilmiş çalışma değiştirilemez."},409)
                    db.execute("DELETE FROM responses WHERE assignment_id=? AND question_id=?",(aid,qid))
                return self.send_json({"ok":True})
            if len(parts) != 3 or parts[:2] != ["api", "assignments"]:
                raise ValueError("Bilinmeyen işlem.")
            if not self.require("parent"): return
            aid = int(parts[2])
            with DB_LOCK, connect() as db:
                assignment = db.execute("SELECT id FROM assignments WHERE id=?", (aid,)).fetchone()
                if not assignment:
                    return self.send_json({"error": "Çalışma bulunamadı."}, 404)
                responses = db.execute("SELECT COUNT(*) FROM responses WHERE assignment_id=?", (aid,)).fetchone()[0]
                reviews = db.execute("SELECT COUNT(*) FROM reviews WHERE assignment_id=?", (aid,)).fetchone()[0]
                study_features.delete_assignment(db, "test", aid)
                db.execute("DELETE FROM reviews WHERE assignment_id=?", (aid,))
                db.execute("DELETE FROM responses WHERE assignment_id=?", (aid,))
                db.execute("DELETE FROM assignment_questions WHERE assignment_id=?", (aid,))
                db.execute("DELETE FROM assignments WHERE id=?", (aid,))
            return self.send_json({"ok": True, "responsesDeleted": responses, "reviewsDeleted": reviews})
        except (ValueError, TypeError, *database.ERRORS) as exc:
            return self.send_json({"error": str(exc)}, 400)


if __name__ == "__main__":
    init_db()
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    local_url = f"http://127.0.0.1:{PORT}"
    print(f"CioOkul hazır: {HOST}:{PORT}" if SETUP_TOKEN_REQUIRED else f"CioOkul hazır: {local_url}", flush=True)
    if os.environ.get("CIO_NO_BROWSER") != "1":
        webbrowser.open(local_url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
        database.close_pool()
