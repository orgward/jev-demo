import fs from "node:fs";
import path from "node:path";
import { choice, noul, score, TypeSafeClient } from "@typesafe-ai/sdk";

type Question =
  | { type: "noul"; instructions: string }
  | { type: "choice"; instructions: string; criteria: Record<string, string> }
  | { type: "score"; instructions: string; criteria: string[] };

const here = path.join(process.cwd(), "demo", "semantic-conformance");
const read = (name: string) => JSON.parse(fs.readFileSync(path.join(here, name), "utf8"));

const model = read("model.json");
const projection = read("projection.json");
const questions = read("questions.json") as Record<string, Question>;

if (!process.env.TYPESAFE_API_KEY) {
  throw new Error("TYPESAFE_API_KEY is required");
}

const state = JSON.stringify({
  purpose: "semantic architecture conformance",
  enterprise_model: model,
  code_semantic_projection: projection,
  constraints: [
    "Judge semantic responsibility, not class naming.",
    "Use only supplied evidence.",
    "Do not infer implementation facts absent from the projection."
  ]
}, null, 2);

async function main() {
  const client = new TypeSafeClient();
  const typedQuestions: Record<string, unknown> = {};

  for (const [id, question] of Object.entries(questions)) {
    if (question.type === "choice") {
      typedQuestions[id] = (choice as any)(question.instructions, question.criteria);
    } else if (question.type === "noul") {
      typedQuestions[id] = (noul as any)(question.instructions);
    } else {
      typedQuestions[id] = (score as any)(question.instructions, question.criteria);
    }
  }

  const result = await (client.systemOne as any)({
    state: { context: state },
    questions: typedQuestions
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
