"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function isOwner(docId: string): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false; // not signed in → definitely not owner

  const [row] = await db
    .select({ ownerId: documents.ownerId })
    .from(documents)
    .where(eq(documents.id, docId));

  // row is undefined if the doc doesn't exist
  return row?.ownerId === userId;
}
