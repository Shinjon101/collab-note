"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";

export const updateContent = async (docId: string, encodedContent: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    await db
      .update(documents)
      .set({ content: encodedContent })
      .where(eq(documents.id, docId));
  } catch (error) {
    console.error("Failed to update content:", error);
  }
};
