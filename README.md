# LogiControl — Canonical Documentation

This repository is the **single source of truth** for LogiControl's product, business, domain and
cross-system architecture knowledge. It contains no application source code.

LogiControl is a Transport Operating System for logistics companies in Uzbekistan and Central
Asia, replacing fragmented Telegram/phone/Excel operations with one controlled operational and
financial system.

## Implementation repositories

| Repository | Owns |
|---|---|
| [logicontrol-backend](https://github.com/isadulla7/logicontrol-backend) | Spring Boot modular monolith, backend modules, Flyway migrations, backend tests and CI, backend Cowork state, backend implementation ADRs |
| [logicontrol-android](https://github.com/isadulla7/logicontrol-android) | Native Android driver application, mobile architecture, mobile CI, mobile Cowork state, Android implementation ADRs |

`logicontrol-ios` exists as an empty placeholder. There is no iOS implementation and none is
planned — ADR-015 records iOS as unfunded work, and a new ADR superseding it is required before
any iOS client is built.

## Contents

| Path | Canonical for |
|---|---|
| `product/business-rules-uz.md` | Product vision, V1 scope, business rules |
| `domain/domain-model-erd-uz.md` | Domain model and ERD |
| `domain/GLOSSARY.md` | Shared terminology |
| `architecture/system-architecture-uz.md` | Cross-system architecture |
| `architecture/backend-architecture.md` | Backend architecture summary and pointer |
| `architecture/mobile-architecture.md` | Mobile architecture summary and pointer |
| `adr/` | Global (cross-repository) ADRs |
| `roadmap/development-roadmap-v1.0-uz.md` | Programme roadmap P00–P13 |
| `integrations/README.md` | External integration specifications |
| `ai/` | Compact programme-level AI context |

Start at [`START_HERE.md`](START_HERE.md). Ownership rules are in [`OWNERSHIP.md`](OWNERSHIP.md).
Migration provenance is in [`PROVENANCE.md`](PROVENANCE.md).

## Rule

Where an implementation repository's local context disagrees with this repository on product,
business, domain or global architecture, **this repository wins**. Implementation repositories
may keep short derived summaries, but they must be marked as derived and must not restate a
global decision differently.
