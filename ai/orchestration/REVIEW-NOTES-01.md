# Batch 01 — what review actually caught, and with which question

Distilled by the Global Orchestrator from Batch 01, for the briefing of design and review lanes in
later batches. Every claim here is attributed, because the subject is provenance and a note about
provenance that carries none would be self-refuting.

This is a working note, not an accepted decision. Nothing here amends a protocol. Where it
disagrees with an accepted ADR, the ADR wins and this note is the defect.

## 1. The defect class that dominated the batch

Almost none of the real defects were false citations. The citations were real, and they said what
they were cited for. **The defect lived in the gap between what a source states and what a sentence
concludes from it.**

That is invisible to the check that catches everything else. `review-des002` established it from
its own record rather than by argument: it verified 23 citations across two rounds, every one was
real, and a false premise sat intact underneath the strongest structural rule in the package the
whole time.

Both design lanes reached the same root cause from opposite ends, and both located it in the
instrument rather than in anyone's care:

- **`mobile-design-auth`:** a four-tag scheme with FACT / PLATFORM / PROPOSAL / ASSUMPTION had **no
  slot for a conclusion drawn from cited facts**. A derivation must be tagged something, and with
  no correct option it lands on FACT, because the sentence is built out of facts and every citation
  in it is real. *"A four-tag scheme does not merely fail to catch this defect — it manufactures
  it, because every derivation must be mislabelled to be labelled at all."*
- **`web-design-org`:** a scheme that lets an **absence of canon** be marked as an assumption
  manufactures phantom rows in the dependency register — entries a backend reader is asked to
  confirm or refuse when nothing is being relied on. *"There is nothing to confirm about something
  nobody is relying on."*

Both lanes independently added a `DERIVED` marker and converged on the same name without
coordination.

## 2. The limit of markers, established three times

A marker is **a self-assessment of provenance made by the author of the sentence.** Nothing
verifies the *decision* to mark.

- `review-des002`: *"You cannot mark what you do not see as a claim."* All three of that lane's
  worst errors were sentences the author did not experience as claims at all — scaffolding for a
  point, not the point.
- `web-design-org`: *"The marking convention only protects the sentences you thought to mark, and
  the three worst errors in this package were all in sentences I did not."*
- `review-des001`: the two defects that survived an approval, five closures, a full sweep, a new
  tag and the author's own conscious hunt were **both untagged prose**. The tag never got a chance
  at either.

`web-design-org`'s summary of the consequence: **`DERIVED` does not make derivations safe. It makes
them reviewable, and somebody still has to review them.**

## 3. Three questions. All three needed from the first pass.

`review-des001` supplied the repertoire and then narrowed it, refusing a claim its evidence could
not carry. Both halves are recorded, because the refusal is the more instructive part.

| Defect kind | The question that reaches it |
|---|---|
| The citation is wrong or absent | Does this citation exist and say this? |
| The citation is real but does not state the claim | **Does the source *state* this, or merely *support* it?** |
| The claim is about what the design itself does | **Does the mechanism do this?** — which means opening the mechanism and re-deriving |

**A reviewer told only "check the citations" is structurally incapable of finding kinds two and
three.** The proof is not an argument: `review-des002`'s first two rounds verified 23 real citations
and returned clean over a false premise.

**What was proposed and then withdrawn.** The mobile lane observed that its one paragraph failed
three times in three different ways, each subtler than the last, and proposed that *each correction
closes the channel the previous defect used, pushing the next defect into the channel the
correction made attractive.* `review-des001` declined to brief it: the claim is drawn from one
paragraph, a benign explanation fits identically — three attempts at a genuinely hard claim produce
progressively subtler residual errors, because that is what converging looks like — and the
package's own record contradicts the ladder, since citation-level and mechanism-level defects
interleave across passes rather than escalating. The narrower true version:

> **Three distinct defect kinds, three different questions, all three needed from the first pass,
> and the round number does not predict which one catches what.**

## 4. Two checks that are mechanical and cheap

Neither is complete. Both are bounded, operate on prose, and cost minutes.

**Identifier pairing** (`review-des001`). Every claim carrying an identifier — `F-`, `A-`, `PF-`,
`D-`, `[C]` — is checkable against that identifier's defining row. **Read the row, not the claim,
and ask whether the claim *is* the row or a conclusion from it.** Four of the five defects that
lane produced were refuted by its own files this way. The tag audit caught none of them.

**Absolutes are greppable** (`review-des002`). All three of the web lane's worst errors were stated
as absolutes — *"is forbidden"*, *"structurally incapable"*, *"were checked and are clean"*.
Absolutes are the cheapest claims to falsify. A grep for absolute constructions in unmarked prose,
each hit checked against a file, catches two of the three. It misses anything not phrased as one.

## 5. The author-side habit

`review-des002`: the class is not about the shape of a sentence but about **the source of belief.**
Every one of these came from context — process knowledge, memory of one's own earlier work, a
half-remembered constraint — rather than from a file opened that day. The drafting prompt:

> **"Could I have written this sentence without opening any file?"** If yes, its warrant is memory,
> and memory is where the whole class lives.

## 6. Pointing at a referent versus citing a warrant

`mobile-design-auth` fixed an uncited inference by pointing it at the table it describes, then
asked whether that was the same move under a new name — *"'I found a legitimate reason to cite
something' is exactly what round 2 would have said about itself."* The question is a good one and
the answer is structural rather than a matter of intent. `review-des001`:

> **Can the thing you point at return "no"?**
>
> A **warrant** can only confirm or abstain. A **referent** can confirm or refute.

Worked example from this batch. A rule cited `F-01`, which is *silent* on device form factor;
silence reads as absence-of-contradiction, which reads as support. `F-01` could never have returned
"no", and establishing its silence required a grep across four documents *from outside the claim*.
By contrast, the claim *"at `GRACE_EXPIRED` the device stops accepting new business writes"* points
at a table whose row reads "no new writes" — had that cell said "Yes", the claim would be dead on
the page. It had already returned "no" once: the reviewer's refutation of the previous version came
from that same table.

Second discriminator, easier while drafting: **does the claim *describe* the referent, or merely
draw support from it?** Restatements are settled by comparison. Inferences licensed by citations are
not.

The guard, because the move degrades: **point only at a referent that could say no to *this
specific sentence*.** In that same paragraph, "the only control that exists" pointed at the same
table would be the old error again — that table can only abstain on whether other controls exist.

## 7. What this cost, and whether it was worth it

**The counting rule first, because the earlier figures here stated none and were not reachable from
any population.** One *review pass* is one comment on a `logicontrol-docs` pull request, written by
a reviewer that did not write the work under review, returning a verdict or a verification result
against a named commit or range. The author's own responses to a review are excluded. The
population is the four `logicontrol-docs` pull requests this batch produced or answered — #3, #4,
#5 and #6.

On that rule, at `2026-08-25T15:40Z`: **twenty-seven review passes** — seven on PR #3, six on
PR #4, eight on PR #5, six on PR #6. Anyone can re-derive it with
`gh api repos/isadulla7/logicontrol-docs/issues/<n>/comments` and subtract the author responses,
which are one each on #3, #5 and #6 and none on #4.

Backend PR #10 is deliberately outside that population rather than being the fourth pull request:
it carries **zero** pull-request comments, and its verdicts are events in
`logicontrol-backend/.ai/cowork/tasks/T012.md` — a different artefact under a different rule, and
the reason a single "four pull requests" figure could not be made to add up. Counted the same way,
that log carries its own independent QA, Independent Reviewer and Security Reviewer passes.

**The number of review agents is not stated, because it is not derivable from the artefacts.** Four
reviewer identities name themselves in their comments — `review-batch01`, `review-docs-pr3`,
`review-des002` and `review-docs-design` — and the DES-001 and ADR-019 reviewers do not name
themselves at all. Every comment is authored by the same GitHub account, so the account is not
diagnostic either; this is the same limit `BATCH-01.md` §8's `D-5` records about commit authorship.
Any total would be a guess, and a note whose first line is that every claim here is attributed
cannot carry one.

The earlier wording — *"four review agents, thirteen review passes across four pull requests"* —
stated neither rule nor population, and thirteen is not reachable from either reading. It is
recorded rather than quietly replaced, because it is the one claim in this note that was not
checkable, in the note about provenance.

Against that cost: a false premise under a package's strongest structural rule, an invalid
derivation that had reached the recommendation the programme owner reads, an assumption asserted as
canon on the most consequential number in an open decision, and a conditional that inverted its own
advice in the branch where acting on it is least recoverable — each found by someone who did not
write it. And one paragraph that needed three rounds and a different question each time.

The Orchestrator's own record needed **eight revisions** and drew **thirty-one findings** across the
**seven independent review passes** on PR #3 — sixteen from `review-batch01` over revisions 1–5,
eleven from `review-docs-pr3` on revision 7, and four more from `review-batch01` over
`c237e94..8fba279`. Not one of the thirty-one was found by the Orchestrator that wrote the record.
That is the strongest evidence in the batch for independent review as a control rather than a
formality.
