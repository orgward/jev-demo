import fs from "node:fs";
import path from "node:path";
import { TypeSafe } from "@typesafe-ai/sdk";

const here = path.join(process.cwd(), "demo", "semantic-conformance");
const read = (name: string) => JSON.parse(fs.readFileSync(path.join(here, name), "utf8"));

const model = read("model.json");
const projection = read("projection.json");
const questions = read("questions.json");

if (!process.env.TYPESAFE_API_KEY) {
  throw new Error("TYPESAFE_API_KEY is required");
}

const state = {
  purpose: "semantic architecture conformance",
  enterprise_model: model,
  code_semantic_projection: projection,
  constraints: [
    "Judge semantic responsibility, not class naming.",
    "Use only supplied evidence.",
    "Do not infer implementation facts absent from the projection."
  ]
};

async function main() {
  // Keep SDK coupling here. If early-access SDK naming changes, only this adapter changes.
  const client: any = new (TypeSafe as any)({ apiKey: process.env.TYPESAFE_API_KEY });

  const judge =
    client.judge?.bind(client) ??
    client.evaluate?.bind(client) ??
    client.questions?.evaluate?.bind(client.questions);

  if (!judge) {
    throw new Error("Unsupported @typesafe-ai/sdk shape: adapt run.ts to the installed early-access SDK.");
  }

  const result = await judge({ state, questions });
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
