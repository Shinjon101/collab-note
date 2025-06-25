"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";

export const isOwner = async (docId: string) => {
  const { userId } = await auth();
  if (!userId) return false;

  const [row] = await db
    .select({ id: documents.id })
    .from(documents)
    .where(eq(documents.id, docId));

  return row?.id ? true : false; // only owner can call, so just exists check
};
