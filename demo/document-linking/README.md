# Sophisticated demo — Large-document enterprise model linking

## Intent

Show how a large, messy enterprise document can be connected to an existing OrgWard enterprise graph without asking a generative model to rewrite the document or mutate the graph.

The core question is bounded:

> **Which already-known enterprise entities does this passage materially relate to, and how strong is that linkage?**

Examples of target entities include capabilities, processes, information concepts, systems, policies and strategic objectives.

```text
large document
     |
     v
deterministic chunking + metadata
     |
     v
candidate retrieval from enterprise graph
     |
     +---- relevant candidate entity slice
     |
     v
Jev bounded linkage judgments
     |
     v
links + probability + evidence/provenance
     |
     v
OrgWard enterprise graph
```

## Why this matters

A 40-page strategy or policy document can mention dozens of business concepts using language different from the canonical enterprise model. Keyword matching can retrieve candidates, but cannot reliably establish that a paragraph about "reducing repeated requests for company details" materially concerns the canonical **Customer Onboarding** process and **Customer Information Management** capability.

Jev is used only for the semantic boundary. Retrieval should first narrow thousands of graph entities to a small candidate set.

## Worked example

`strategy-document.md` is a synthetic banking transformation paper containing relevant passages, background prose and deliberate near-matches. `enterprise-model.json` contains the existing canonical graph slice.

For each chunk the demo asks bounded questions such as:

* Which candidate capability is materially addressed?
* Which process is materially addressed?
* Does the passage materially concern the canonical Customer information concept?
* How strong is the linkage?
* Is the evidence sufficient to create a proposed graph link?

The output should retain the exact source chunk/document ID. A link without provenance is not useful enterprise knowledge.

## Repository-scale design

Do **not** send a 200-page document and the whole enterprise graph to Jev.

1. Parse document and retain page/section/paragraph provenance.
2. Chunk by semantic/document structure rather than arbitrary token windows where possible.
3. Use lexical/vector/graph retrieval to produce perhaps 5–20 candidate entities per chunk.
4. Send the chunk + concise candidate definitions/relationships to Jev.
5. Ask bounded Choice/Noul/Score questions.
6. Persist proposed links with probability, evidence, model revision and document revision.
7. Apply thresholds to auto-link only calibrated high-confidence cases; queue ambiguous cases for review.

The scalable unit is therefore **passage × candidate enterprise neighborhood**, not document × entire enterprise model.

This demo focuses only on **linking to existing entities**. It does not ask Jev to invent capabilities or modify the enterprise model.
