# Sophisticated demo — Continuous Semantic Architecture Conformance

## Intent

Demonstrate a boundary conventional static analysis does not solve well: whether running software still **means what the enterprise model says it means**.

The demo deliberately does **not** invent another full code IR. It uses a mature code representation such as a Code Property Graph (CPG) for deterministic facts, projects only business-relevant facts into a compact semantic projection, retrieves the relevant enterprise concept/information-model slice, and asks Jev to make bounded semantic judgments.

```text
real source code
   |
   v
AST / CFG / data-flow / CPG       deterministic
   |
   v
OrgWard semantic projection       compact, language-agnostic
   |                 +
   |          enterprise model slice
   +-----------------+
           |
           v
          Jev
 Choice / Noul / Score
           |
           v
 deterministic conformance policy
           |
    pass / warn / human review
```

The separation is important:

* deterministic tooling establishes **what the code structurally does**;
* OrgWard supplies **what enterprise concepts mean**;
* Jev judges **whether the two meanings align**;
* deterministic policy decides what happens with that judgment.

This is an experimental semantic control, not a compiler/type checker or a replacement for normal static analysis.

## Worked example

The sample is intentionally realistic enough to expose semantic drift. A Java class named `Customer` contains an `accountNumber`, `ledgerBalance` and `freeze()`. Syntactically it is valid. The enterprise model says Customer is a Party in a customer relationship, while Account is the financial contract that owns account number, balance and frozen status.

The extractor therefore produces facts rather than asking Jev to understand hundreds of implementation lines. Jev receives those facts plus the model definitions and independently judges:

1. **Noul — Customer conformance:** does the implementation faithfully represent enterprise Customer?
2. **Choice — Primary concept:** Customer, Account, mixed/ambiguous, or none.
3. **Score — Semantic alignment:** contradiction → faithful implementation.

A policy can then require high confidence for automatic acceptance, warn on moderate ambiguity, and route contradictory/high-uncertainty cases to an accountable architect.

## Why CPG first

CPG/AST tooling already represents classes, methods, calls, types, control/data flow and dependencies. OrgWard should not duplicate it. The OrgWard layer is an application-specific semantic overlay/projection: entity/service/event/operation, reads/writes, dependencies and other facts useful for mapping implementation to domain concepts, information objects, bounded contexts, capabilities, processes and policies.

Longer-term chain:

```text
class → domain concept → information object → bounded context
      → business capability → process → policy → responsibility
```

The hard and valuable part is the mapping between those layers, not parsing source syntax.

## Run the standalone example

```bash
npx tsx demo/semantic-conformance/run.ts
```

It expects `TYPESAFE_API_KEY`. The request builder is isolated in `run.ts` so SDK/API-shape changes can be adapted without changing the example domain.

## Production direction

For a repository-scale implementation:

1. Parse supported languages with mature AST/CPG tooling.
2. Deterministically extract/prove structural facts and retain provenance to file/symbol/line.
3. Build a compact semantic projection; do not send the whole repository.
4. Retrieve only candidate concepts and their necessary relationships/definitions.
5. Send projection + model slice + bounded typed questions to Jev.
6. Persist probabilities, model/version, source/model revisions and evidence.
7. Apply calibrated deterministic thresholds; never let free-form generation directly decide enforcement.
8. Evaluate thresholds against labeled architecture-review cases before using the result as a control.

This keeps context bounded and makes the judgment auditable. A future OrgWard implementation can use the same projection regardless of whether the source is Java, C#, Python or Go.
