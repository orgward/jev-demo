# Jev Enterprise Decision Lab

Interactive enterprise decision-pattern catalogue demonstrating where Jev's constrained probabilistic judgments can complement deterministic systems, generative AI, agents, and human review.

## MVP direction

- Broad enterprise scenario catalogue: knowledge, architecture, SDLC, agents, data, risk/compliance, security, operations, customer service, finance, procurement, organization, portfolio, process, documents, meetings, strategy, change and product.
- Each scenario exposes: problem → context → Jev questions → probabilities/scores → deterministic policy → resulting action.
- Editable inputs and live Jev execution.
- Architecture/developer view with request/response, latency and decision rules.
- Cross-scenario dashboard and “run all” experience.
- Autonomous-enterprise / OrgWard reference architecture.
- API credentials stay server-side.

## Security

Never commit Jev credentials. Runtime code must read `TYPESAFE_API_KEY` from the environment.

> Note: a GitHub Actions repository secret is available to Actions workflows; an application deployed elsewhere will need the same secret configured in that runtime environment.

## Status

MVP implementation starting.
