"use server";

import { auth } from "@clerk/nextjs/server";
import { summaries } from "@/db/schema";
import { db } from "@/db";
import { eq, and, gte } from "drizzle-orm";
import { cohere } from "@/lib/cohere";

export async function summarizeDocument(text: string, docId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (!text || text.trim().length == 0)
    throw new Error("Cannot summarize empty text");

  if (text.trim().length < 20)
    throw new Error("Cannot summarize less than 20 words");

  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount > 1000) throw new Error("Text exceeds 1000-word limit.");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const recentSummaries = await db.query.summaries.findMany({
    where: and(eq(summaries.userId, userId), gte(summaries.createdAt, today)),
  });

  /*   if (recentSummaries.length >= 5) {
    throw new Error("Daily limit reached. Try again tomorrow.");
  } */

  const cohereRes = await cohere.chat({
    model: "command-a-03-2025",
    temperature: 0.5,
    messages: [
      {
        role: "user",
        content: `You are a precise text compressor.
        Condense the following text into a single clear passage under 200 words. 
        Be direct, neutral, and factual.
        Text:${text}
        Constraints: Do not use the word "summary" or any variations of "summarize." or "200"
        Without any extraneous commentary.
        Avoid any introductory phrases, questions, or assistant-like responses in your output.
        Example: Original Text: "The cat sat on the mat. It was a sunny day, and the cat enjoyed the warmth."
        Condensed Output: "The cat rested on the mat, savoring the sunny warmth."  
        `,
      },
    ],
  });

  const summary = cohereRes.message.content?.[0]?.text?.trim();
  if (!summary) {
    throw new Error("failed to generate summary");
  }

  await db.insert(summaries).values({
    userId,
    documentId: docId,
    summary,
  });

  return { summary };
}
