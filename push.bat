@echo off
setlocal
cd /d "%~dp0"

echo =========================================
echo       Pushing Portfolio to GitHub
echo =========================================
echo.

echo [1/4] Staging all files across repository...
git add -A

echo.
echo [2/4] Checking staged changes...
git status --short

echo.
echo [3/4] Committing changes...
set "MSG=%~1"
if "%MSG%"=="" set "MSG=Portfolio updates"

git diff-index --quiet HEAD --
if errorlevel 1 (
    git commit -m "%MSG%"
) else (
    echo No new changes to commit.
)

echo.
echo [4/4] Pushing to GitHub (origin main)...
git push origin main
if errorlevel 1 (
    echo.
    echo [Notice] Push rejected, attempting pull rebase...
    git pull origin main --rebase
    git push origin main
)

echo.
echo =========================================
echo       Operation Finished!
echo =========================================
echo.
pause
