@echo off
cd /d %~dp0
if not exist node_modules (
  npm install
)
if not exist .env (
  copy .env.example .env
  echo.
  echo IMPORTANT: Open .env and paste your OPENAI_API_KEY, then run this file again.
  pause
  exit /b
)
npm start
pause
