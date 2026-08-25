# LogiControl Glossary

Shared terminology across backend, mobile and product work. A term means the same thing in every
repository. The full model is in [`domain-model-erd-uz.md`](domain-model-erd-uz.md); this file
fixes the vocabulary, not the schema.

## Tenancy and identity
| Term | Meaning | Owner module |
|---|---|---|
| **Company** | The tenant root. Every tenant-owned row carries `company_id`. Knowing a UUID is never authorization. | organization |
| **CompanyMember** | A user's membership of a Company, carrying role and status. | organization |
| **Role / Permission** | The RBAC model evaluated after Company context is resolved. | organization |
| **AuthenticationIdentity / Session** | Who is authenticated, separate from what they may do in a Company. | identity |

## Operations
| Term | Meaning | Owner module |
|---|---|---|
| **Driver** | A person operating trips for a Company. The MVP user of the mobile client. | fleet |
| **Vehicle** | A truck or van owned or operated by the Company. | fleet |
| **VehicleAssignment** | The time-bounded, historised link between a Driver and a Vehicle. | fleet |
| **VehicleFuelNorm** | Versioned expected fuel consumption with an effective period. History is never lost. | fleet |
| **Customer** | The party a trip is performed for. Referenced by ID, never nested into Trip. | customer |
| **Trip** | The operational centre of the product. Has an operational status and a separate financial status. | trip |
| **TripLeg** | A child segment of a Trip with its own route, dates and border metadata. | trip |

**Trip operational state**: `DRAFT → PLANNED → READY → ACTIVE → COMPLETED`, with `CANCELLED` by
policy. **Trip financial state** is separate: `OPEN → READY_FOR_SETTLEMENT → SETTLED → CLOSED`.
A Trip never owns Expense, Fuel, WorkOrder or Document entities; those reference it by `tripId`.

## Money
| Term | Meaning | Owner module |
|---|---|---|
| **Money** | An amount plus its currency. Always `BigDecimal`; never `double` or `float`. | shared-kernel |
| **Expense** | A cost incurred against a Trip, Driver or Vehicle. `DRAFT → SUBMITTED → APPROVED \| REJECTED`. | finance |
| **Revenue** | What the Customer is charged for a Trip. | finance |
| **SpendPolicy** | Typed, company-scoped thresholds and approval levels. Not a scripting engine in V1. | finance |
| **Advance** | Money issued to a Driver ahead of settlement. | finance |
| **LedgerEntry** | An append-only financial fact. A posted entry is never updated or deleted; corrections are reversal or correcting entries. | finance |
| **DriverSettlement** | The calculated close-out of a Driver's ledger for a Trip or period. A closed settlement is immutable. | finance |
| **ExchangeRateSnapshot** | The exact rate and source captured at transaction time. A later rate change never rewrites history. | finance |

Finance is the financial source of truth. Fuel and Maintenance own **operational facts**; when
one is linked to an Expense its cost is not recognised twice in P&L.

## Field operations
| Term | Meaning | Owner module |
|---|---|---|
| **FuelEvent** | An observed refuelling: litres, price, odometer, location, evidence. | fuel |
| **FuelVariance** | Expected versus actual litres against the norm snapshot in force. | fuel |
| **WorkOrder** | The repair lifecycle for a Vehicle. The Driver reports a condition; the Driver never owns this lifecycle. | maintenance |
| **RepairItem / Warranty** | Work performed and its warranty cover. | maintenance |
| **ComplianceDocument** | Document metadata and validity, including TIR and DAZVOL. The binary is a FileAsset. | compliance |
| **DocumentRequirement / ComplianceCheck** | What must be present, and the decision about whether it is. | compliance |

## Evidence
| Term | Meaning | Owner module |
|---|---|---|
| **FileAsset** | The canonical metadata record for a stored object: checksum, ownership, lifecycle. Never the binary itself. | files |
| **UploadSession** | A presigned upload in progress. | files |
| **POD** | Proof of delivery. | — |
| **CMR** | The international consignment note for road transport. | — |
| **SHA-256** | The content checksum carried by every uploaded object, supporting integrity, duplicate detection and fraud signals. | — |

Binaries live in MinIO/S3-compatible object storage; PostgreSQL stores metadata only. No BYTEA
or base64 business storage (ADR-005).

## Control and insight
| Term | Meaning | Owner module |
|---|---|---|
| **ControlEvaluation** | The result of applying a control rule to observed facts. | control |
| **Alert** | A **managed issue** with a lifecycle and an owner — not a notification. | control |
| **AuditEntry** | An append-only record of who changed what. Not a replacement for ledger history. | audit |
| **NotificationJob / Delivery** | Orchestration and delivery of a message. Never the business decision behind it. | notification |
| **Driver Score** | A composite V1 rating of driver performance. | analytics |
| **Owner Cockpit** | The owner-facing profitability and control overview. | analytics |

Analytics is CQRS-lite: read models and projections only, rebuildable and reconcilable, never a
transactional source of truth.

## Client and sync
| Term | Meaning |
|---|---|
| **Offline-first** | Every user-visible mobile write commits to local storage first and is acknowledged from local state. Synchronisation happens afterwards, out of band. |
| **Sync Engine** | The mobile component that replays queued operations in causal order with bounded backoff, deduplication and idempotency. A first-class component, not a retry helper. |
| **clientRequestId** | The idempotency key carried by every offline create operation. An identical retry returns the prior outcome; the same key with a different payload is a conflict (ADR-008). |
| **SYNCED** | The state of a locally created item only after backend confirmation. |

## Process
| Term | Meaning |
|---|---|
| **Cowork V1** | The four-role development protocol — Orchestrator, Developer, QA, Independent Reviewer — defined by ADR-013. |
| **R1–R4** | Task risk levels. R4 covers finance posting, tenant and security, architecture rules, the CI gate and ADR changes, and is never auto-approved. |
| **Task packet** | The specification an Orchestrator writes before a Developer starts, including acceptance criteria and file leases. |
| **Vertical slice** | One complete task's work across every layer it touches, rather than a horizontal layer across many tasks. |
| **OPEN-001** | The production authentication UX decision, closed by ADR-019. |
