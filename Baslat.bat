@echo off
cd /d "%~dp0"
set "PYTHON=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
if not exist "%PYTHON%" (
  echo Python bulunamadi. Python 3.10 veya ustunu kurup app.py dosyasini calistirin.
  pause
  exit /b 1
)
"%PYTHON%" app.py
pause
