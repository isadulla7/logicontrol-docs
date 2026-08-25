# ADR-014: Standard API Error Contract

- Status: Accepted
- Date: 2026-08-25

## Context
The Flutter Driver App and the Next.js Web client must handle backend failures programmatically.
Without one agreed error body each adapter invents its own, clients parse English prose, and
internal detail leaks into responses. LogiControl is a shared-database multi-tenant system
(ADR-010), so an error body is also an information-disclosure surface: a 404 that differs from a
403 tells a caller that another company's resource exists.

## Decision
Every HTTP error the platform itself produces is one immutable body, served as
`application/problem+json`, with a fixed field order:

`type`, `title`, `status`, `code`, `message`, `correlationId`, `fieldErrors`

- **Stable codes.** `code` is a machine-readable identifier from a single enumeration
  (`ApiErrorCode`) covering the platform-level failures that exist today: validation, malformed
  request, method not supported, media type not supported, not acceptable, resource not found,
  conflict, internal error. The enum constant name IS the wire code. Codes are never localized,
  reworded or renamed once released; `title` and `message` are fixed English and are not a
  contract. Clients branch on `code`, never on prose. Business modules do not extend this
  enumeration - they own their own domain codes in their own adapters.
- **A framework `ErrorResponse` keeps its status.** `ResponseStatusException` is the idiomatic way
  a module adapter signals 404/409/400; its status is mapped to the enumerated code carrying that
  status instead of being collapsed into a 500. Its `reason`/`detail` is discarded: it is
  developer text that may name internal state. A status this platform does not enumerate is by
  definition not a platform failure and is reported as `INTERNAL_ERROR`; a module needing such a
  status adds its own code and its own mapping.
- **Non-disclosure.** No body ever carries a stack trace, exception class name, SQL fragment,
  internal path, or a rejected raw value. Not-found responses are byte-identical whether or not
  the resource exists, so UUID knowledge cannot be used to probe another company's data (ADR-010).
- **Authentication and authorization are left to the security filter chain.** The advice rethrows
  `AuthenticationException` and `AccessDeniedException` unchanged rather than mapping them.
  Spring Security's `ExceptionTranslationFilter` sits outside the dispatcher and is the only
  component that can decide 401 versus 403 once authentication exists (`OPEN-001`). Mapping them
  in the advice would turn every denial into a 500 and pre-empt that decision.
- **The correlation id is echoed, including when the client supplied it.** `correlationId` is read
  from the MDC key `CorrelationIdFilter` sets, so the body and the `X-Correlation-Id` response
  header always agree. When the client supplies the header, that value is reflected back after
  the filter's own normalization (blank or over-long values are replaced by a generated UUID).
  This is deliberate: a client-supplied id is what makes a client-side log line joinable to a
  server-side one. It is a correlation handle, never an authorization or identity token, and
  nothing in the platform trusts it.

## Consequences
- Clients can implement failure handling once, by code, and can quote one correlation id to
  support for any failure.
- Adding a platform failure means adding one enumerated code plus its mapping and test; changing
  or removing a released code is a breaking client change and requires a superseding ADR.
- The reflected correlation id is attacker-controlled text and appears in logs and in the response
  body. It is length-bounded by `CorrelationIdFilter` and is never interpreted.
- i18n, a published client error catalogue and OpenAPI publication are explicitly out of scope and
  can be layered on later without changing the wire shape.

## Guardrail
The contract is executable: `ApiExceptionHandlerTest` pins the mapping of every handled exception
type and `ApiErrorContractWebTest` pins the wire shape, media type, field order, correlation echo,
non-disclosure and the security rethrow over a real dispatcher.
