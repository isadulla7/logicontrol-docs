@echo off
setlocal EnableExtensions

rem LogiControl Cowork V2 Windows launcher.
rem Expected layout:
rem   <workspace>\logicontrol-docs\cowork-plugin\start-cowork.cmd
rem   <workspace>\logicontrol-backend\
rem   <workspace>\logicontrol-android\

for %%I in ("%~dp0..") do set "DOCS=%%~fI"
for %%I in ("%DOCS%\..") do set "WORKSPACE=%%~fI"
set "PLUGIN=%~dp0"
set "BACKEND=%WORKSPACE%\logicontrol-backend"
set "ANDROID=%WORKSPACE%\logicontrol-android"

if not exist "%DOCS%" (
  echo [ERROR] logicontrol-docs not found: %DOCS%
  exit /b 1
)
if not exist "%BACKEND%" (
  echo [ERROR] logicontrol-backend not found: %BACKEND%
  exit /b 1
)
if not exist "%ANDROID%" (
  echo [ERROR] logicontrol-android not found: %ANDROID%
  exit /b 1
)

where claude >nul 2>nul
if errorlevel 1 (
  if exist "%USERPROFILE%\.local\bin\claude.exe" (
    set "PATH=%PATH%;%USERPROFILE%\.local\bin"
  ) else (
    echo [ERROR] Claude Code CLI not found in PATH.
    exit /b 1
  )
)

set "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1"

set "START_PROMPT=Start LogiControl Cowork V2 as an agent team. Act as the Global Orchestrator. Recover the actual current state from logicontrol-docs, logicontrol-backend and logicontrol-android before dispatching work. Build the dependency DAG and use the minimum safe specialist set. Initial intended independent lanes are backend T012 Company aggregate, mobile design DES-001 OPEN-001 Authentication UX discovery, and web design DES-002 React/Next.js Web IA plus Organization/Company foundation, but do not start any lane whose real repository state or dependency gate is not ready. Use backend, database, android, mobile-designer, web-designer, qa, reviewer, security-reviewer, architecture and devops plugin agent types only when their triggers apply. Preserve Cowork V1.1 lifecycle, risk R1-R4, leases, budgets, independent QA/review and mandatory security review triggers. R4 remains serialized and requires human approval. Backend implementation must enforce SOLID, pragmatic Clean Architecture, LEGO modularity and Spring Modulith boundaries. Do not ask the human to perform routine Git/GitHub operations you can perform. Continue autonomously until a genuine product decision, R4 approval, permission/credential blocker or destructive decision requires the human."

claude --plugin-dir "%PLUGIN%" --add-dir "%DOCS%" --add-dir "%BACKEND%" --add-dir "%ANDROID%" --agent "logicontrol-cowork:global-orchestrator" "%START_PROMPT%"

endlocal
