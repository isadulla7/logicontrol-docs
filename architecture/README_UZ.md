# LogiControl Texnik Arxitekturasi v1.0 — Canonical Engineering Source

## Baseline
Java 21, Spring Boot 3.5.x, PostgreSQL, Maven multi-module, Modular Monolith, Clean Architecture, SOLID, DDD principles, Spring Modulith, Flyway, MapStruct, JUnit 5, Testcontainers, ArchUnit, MinIO/S3. Flutter Driver App va React/Next.js Web clientlar.

## Architecture style
V1 — **Modular Monolith**, bitta deployable Spring Boot application, lekin qat’iy bounded module’lar. Microservice/Kafka/Kubernetes faqat measured requirement va yangi ADR bilan. Maqsad big-ball-of-mud monolith emas, executable boundaries bilan professional monolith.

## Clean Architecture dependency rule
Har module ichida conceptual yo‘nalish: `adapter.in → application → domain`; `adapter.out` application portlarini implement qiladi. Domain plain Java: Spring, JPA, HTTP, Jackson, provider SDK yoki storage SDK’ni bilmaydi. Controller faqat transport/DTO mapping; transaction va business logic application/domain’da.

## Module topology
`identity`, `organization`, `fleet`, `customer`, `trip`, `finance`, `fuel`, `maintenance`, `compliance`, `control`, `analytics`, `files`, `audit`, `notification`, `integration`, kichik `shared-kernel`, va composition root `logicontrol-app`.

Ownership:
- identity: authentication/session
- organization: Company, membership, RBAC
- fleet: Driver, Vehicle, Assignment, fuel norm history
- customer: Customer
- trip: Trip/TripLeg operational lifecycle
- finance: Money, FX, Revenue, Expense, Advance, Ledger, Settlement
- fuel: FuelEvent/expected/variance
- maintenance: WorkOrder/repair/warranty
- compliance: document semantics/requirements
- files: FileAsset/upload/object storage
- control: ControlEvaluation/Alert
- analytics: read models/P&L/score/cockpit
- audit: audit facts
- notification: delivery orchestration
- integration: external provider anti-corruption adapters

## Cross-module constraints
Cross-module repository, JPA entity, internal service import va JPA relationship taqiqlanadi. Immediate validation uchun small public API/snapshot; post-commit reaction uchun immutable event. Cross-module reference typed UUID ID orqali. Cycle taqiqlanadi va Spring Modulith/ArchUnit bilan test qilinadi.

## Aggregate strategy
Trip gigant aggregate emas: Expense, FuelEvent, WorkOrder va ComplianceDocument o‘z modulida own aggregate/entity. TripId reference. Finance economic truth; Fuel/Maintenance operational truth. Bu P&L double-count va ORM graph couplingni oldini oladi.

## Persistence
Bitta PostgreSQL database, logical schema per module. Tenant-owned row: `company_id NOT NULL`. UUID public IDs, typed IDs domain/application’da. Time: `Instant/TIMESTAMPTZ`, business date `LocalDate/DATE`. Money/FX: `BigDecimal/NUMERIC`. Flyway schema owner; applied migration silent edit qilinmaydi. JPA model module-internal infrastructure detail.

## Multi-tenancy/security
Authentication → Principal → Company Context → RBAC → business authorization. UUID bilish access degani emas. Repository contract tenant-owned querylarda company scope talab qiladi. Cross-tenant negative tests majburiy. PostgreSQL RLS keyin defense-in-depth sifatida qo‘shilishi mumkin.

## Transactions/concurrency
Default: one application use case = one local transaction. Transaction controller/domain’da emas, application orchestration boundary’da. Mutable aggregate’lar optimistic locking/version bilan. Conflict silent last-write-wins emas, explicit conflict. Offline/mobile create commandlar company+operation+clientRequestId unique idempotency va request hash bilan retry-safe.

## Events
Past-tense, immutable, small payload. Domain/JPA objects event payload emas. Critical post-commit listenerlar Spring Modulith event publication tracking bilan durable. Kafka V1’da yo‘q.

## Files
Mobile compress/resize; backend upload session/presigned URL beradi; binary to‘g‘ridan MinIO/S3; DB FileAsset metadata/checksum/ownership. DB’da BYTEA/base64 saqlash yo‘q. Object lifecycle va metadata consistency test qilinadi.

## Query architecture
Pragmatic CQRS-lite: write side domain/use-case oriented; dashboards/P&L/score bounded optimized query repository/projectionlardan. Distributed CQRS yo‘q. Analytics source of truth emas va projections rebuild/reconcile qilinadi.

## API
REST `/api/v1`. Request DTO → Command/Query → Use Case → Result → Response DTO. JPA/domain entity response qilinmaydi. Standard error contract `application/problem+json` uslubida stable code/message/correlationId/fieldErrors beradi. Pagination va bounded querylar majburiy.

## Shared kernel
Faqat truly shared stable primitive: Money, CurrencyCode, DomainEvent kabi. `BaseEntity`, `CommonService`, `BaseRepository`, `GenericCrudService`, `CommonUtils` dumping-ground abstractionlar taqiqlanadi.

## Testing
- Domain unit tests: no Spring.
- Application/use-case tests.
- PostgreSQL integration tests: Testcontainers, H2 emas.
- Spring Modulith module verification.
- ArchUnit dependency tests.
- Finance: reconciliation, idempotency, concurrency, reversal, FX, rounding regression tests.
- Flyway migration validation.

## CI quality gate
Har PR uchun `mvn clean verify`. Compilation/test/module/architecture/migration failure bo‘lsa merge yo‘q. Test disable/exclude yoki architecture rule’ni yumshatish bilan fake-green qilish taqiqlanadi.

## Observability
Actuator, Micrometer, correlation ID, structured logging. Sensitive data log qilinmaydi. Technical logs va business audit alohida concern. Backend stateless bo‘lib horizontal instance’ga tayyor.

## Deployment
V1: reverse proxy/load balancer → stateless Spring Boot instance(s) → PostgreSQL + MinIO/S3. Redis default dependency emas. Backup/restore, DB/object storage consistency, graceful shutdown va health probes production hardening phase’da verifikatsiya qilinadi.

## AI-assisted development
Tasklar Phase → Task → small vertical slice shaklida. Claude/Codex har session `.ai/CURRENT_STATE`, architecture rules, module index, relevant ADR/task va faqat kerakli source’larni o‘qiydi. Butun repo/PDF’ni qayta scan qilish default emas. Kod quality, business correctness, tests va readability speed’dan ustun.

## Architecture non-negotiables
No cross-module repo/JPA; no controller business logic; no domain framework dependency; no financial float/double; no mutable Ledger; no giant Trip graph; no unscoped tenant query; no silent financial overwrite; no speculative Kafka/Redis/microservice; no provider SDK in domain; no generic CRUD architecture; no merge without architecture/test quality gate.
