@echo off
REM ==============================================================================
REM ROOTED™ Launch Hub (Windows CMD / PowerShell Launcher)
REM ==============================================================================

set SCRIPT_DIR=%~dp0
node "%SCRIPT_DIR%scripts\hub.cjs" %*
