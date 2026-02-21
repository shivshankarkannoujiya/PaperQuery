import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { ENV } from "../config/env.js";
import OpenAI from "openai";

const AI = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
});

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: ENV.OPENAI_API_KEY,
});

let vectorStore = null;

const getVectorStore = async () => {
  if (!vectorStore) {
    vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
      url: ENV.QDRANT_URL,
      collectionName: "pdf-docs",
    });
  }
  return vectorStore;
};

export async function* askToRagStream(question) {
  const store = await getVectorStore();

  const retriever = store.asRetriever({ k: 4 });
  const relevantDocs = await retriever.invoke(question);

  const context = relevantDocs.map((doc) => doc.pageContent).join("\n\n");

  const SYSTEM_PROMPT = `
You are a helpful AI assistant.
Answer ONLY using the provided context.
If the answer is not present, reply: "Not found in document".

Context:
${context}
  `.trim();

  const stream = await AI.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: question },
    ],
  });

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) yield { token };
  }

  yield { done: true, docs: relevantDocs };
}
