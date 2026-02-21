import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { ENV } from "../config/env.js";
import OpenAI from "openai";


const AI = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY
})

export const askToRag = async (question) => {

    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
      apiKey: ENV.OPENAI_API_KEY,
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: ENV.QDRANT_URL,
        collectionName: "pdf-docs",
      },
    );

    const retriver = vectorStore.asRetriever({
        k: 4
    })

    const relevantDocs = await retriver.invoke(question);

    // building context
    const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");

  const SYSTEM_PROMPT = `
  
  You are a helpful AI assistant.
  Answer ONLY using the provided context.
  If answer is not present, reply: "Not found in document".
   
  context:
  ${JSON.stringify(context)}

  Question:
  ${question}
  `;

  const result = await AI.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { "role": "system", "content": SYSTEM_PROMPT },
      { "role": "user", "content": question },
      
    ]
  })

  return {
    message: result.choices[0].message.content,
    docs: result
  }
}


