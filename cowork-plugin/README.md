# LogiControl Cowork V2 Runtime Plugin

This directory packages the reusable LogiControl Cowork V2 roles as a Claude Code plugin and provides a Windows launcher for the multi-repository workspace.

## Requirements

- Claude Code `2.1.32+` (tested target: current native Claude Code; owner currently uses `2.1.245`).
- The three repositories must be sibling directories:

```text
<workspace>/
  logicontrol-docs/
  logicontrol-backend/
  logicontrol-android/
```

- Claude Code must be authenticated.

## Start

From PowerShell or Command Prompt, run:

```powershell
.\logicontrol-docs\cowork-plugin\start-cowork.cmd
```

The launcher:
1. resolves the sibling repositories;
2. validates all three Git repositories exist;
3. finds Claude Code (including the native `%USERPROFILE%\.local\bin\claude.exe` fallback);
4. enables experimental Agent Teams for this process only;
5. loads this plugin with `--plugin-dir`;
6. grants Claude access to docs/backend/Android with `--add-dir`;
7. starts the main session as `logicontrol-cowork:global-orchestrator`;
8. submits the Cowork V2 startup instruction automatically.

No PowerShell execution-policy change is required because the launcher is `.cmd`.

## Runtime topology

```text
Human / Product Owner
        |
Global Orchestrator
        |
+-------+----------------------+------------------+
|                              |                  |
Product / Design               Backend            Android
|                              |                  |
+-- mobile-designer            +-- backend        +-- android
+-- web-designer               +-- database*      +-- qa/reviewer
                               |
                               +-- qa/reviewer

On demand: architecture / security-reviewer / devops
```

`*` Database is used only when the task actually needs persistence/schema expertise.

## Plugin agents

- `global-orchestrator` — programme/team lead; normally no implementation.
- `backend` — Java/Spring implementation under SOLID/Clean/LEGO/Spring Modulith rules.
- `database` — PostgreSQL/Flyway specialist, on demand.
- `android` — native Kotlin/Compose offline-first implementation.
- `mobile-designer` — Driver mobile Product/UI/UX.
- `web-designer` — React/Next.js admin/operator Product/UI/UX.
- `qa` — independent verification and quality gates.
- `reviewer` — independent production review.
- `security-reviewer` — adversarial security review under Cowork V1.1 triggers.
- `architecture` — architecture/cross-repo contract decisions, on demand.
- `devops` — CI/CD/runtime/platform work, on demand.

## Operating rules

- Repository-local Cowork and architecture files remain authoritative for implementation execution.
- Agent Team parallelism is used only for genuinely independent work.
- R4 remains serialized and human-approved.
- The implementation author never acts as its own QA/Reviewer.
- Web and Mobile Designers may run ahead of implementation but may not invent business/security rules.
- Backend code must follow SOLID, pragmatic Clean Architecture, LEGO-style modularity and Spring Modulith boundaries.
- No Flutter, no KMP now, no iOS implementation.

## Inspect agents while running

Inside Claude Code:

```text
/agents
```

Plugin agents should appear with the `logicontrol-cowork:` namespace. Agent Team teammates are shown in the team lead UI; use the normal Claude Code Agent Teams controls to switch/message teammates.

## Troubleshooting

If `claude` is not found, verify:

```powershell
claude --version
```

The launcher also checks `%USERPROFILE%\.local\bin\claude.exe` automatically.

If a repository is missing, clone/pull it into the same parent folder as the other two repositories. Do not edit the launcher to point at three unrelated directories unless the workspace topology is intentionally changed.
