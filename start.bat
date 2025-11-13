@echo off
cd /d "%~dp0"

if not exist "node_modules" (
  echo First run, installing dependencies...
  npm install
)

echo Starting local preview server (Ctrl+C to stop)...
npm run preview
