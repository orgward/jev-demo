# Jev Enterprise Decision Lab

A live reference implementation for exploring **typed probabilistic judgment as an enterprise primitive**.

The lab contains 24 synthetic enterprise decision patterns across knowledge, architecture, autonomous SDLC, agents, AI platform routing, data, risk/compliance, security, operations, customer service, finance, procurement, organization design, portfolio, process, documents, meetings, strategy, change, product and engineering.

## What the demo shows

Every scenario follows the same architecture:

**enterprise state → Jev typed questions → probabilities/scores → deterministic policy → system/agent/human action**

The UI lets you edit the state, run the decision live, inspect Choice/Noul/Score results and probabilities, and inspect the request shape in an architecture/developer view.

This is deliberately **not** a chatbot. The hypothesis is that many enterprise workflows need small bounded semantic judgments that software can branch on, while generative models remain appropriate for synthesis and humans remain accountable where authority or ambiguity requires them.

## Run locally

Requires Node.js 20+ and Jev early access.

```bash
npm install
cp .env.example .env.local
# set TYPESAFE_API_KEY in .env.local
npm run dev
```

Open http://localhost:3000.

## Configuration

```text
TYPESAFE_API_KEY=...
JEV_MODEL=jev-latest
```

The API key is used only by the server route. It is never sent to the browser.

### GitHub secret

The repository secret `TYPESAFE_API_KEY` is injected into CI for build validation. GitHub Actions secrets are **not** runtime hosting secrets. When deploying to Vercel, Cloud Run, Azure, etc., configure the same environment variable in that platform.

## Scenario design

Each pattern includes:
- enterprise problem and editable state;
- one or more Jev primitives: **Choice**, **Noul**, **Score**;
- a deterministic policy boundary;
- intended resulting action;
- risk level and accountable actor.

Examples include knowledge/slop gating, architecture-review routing, requirements readiness, autonomous-action gating, context filtering, AI model routing, incident ownership, security-review triggers, entity resolution, policy applicability, customer intent, invoice exceptions, vendor fit, role overlap, portfolio duplication, process exceptions, document supersession, meeting decision extraction, strategy alignment, change impact, feedback clustering, audit evidence, semantic code review, RAG reranking and human escalation.

## Production caveats

This is an **experimental demonstration**, not a production control system.

- Keep arithmetic, dates, hard constraints, identifiers and deterministic business rules in code.
- Tune thresholds using representative labeled data for each use case.
- Pin a Jev model version once a use case has been evaluated.
- Higher-consequence actions require stricter gates and human/accountable-owner controls.
- Treat synthetic scenarios as illustrations, not benchmarks or evidence of model accuracy.
- Minimize state sent to external model APIs according to enterprise data-handling requirements.

## Architecture

```text
Enterprise state
      |
      v
 deterministic preprocessing
      |
      v
  Jev judgment
 Choice / Noul / Score
      |
      v
 deterministic policy
      |
  +---+--------+----------+
  |            |          |
system       agent       human
action       action      review
```

## CI

The GitHub Actions workflow runs TypeScript validation and a production Next.js build on pushes and pull requests.
