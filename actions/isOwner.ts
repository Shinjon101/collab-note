"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { documents, users } from "@/db/schema";
import { eq } from "drizzle-orm";

interface returnType {
  owns: boolean;
  ownerName: string;
}

export async function isOwner(docId: string): Promise<returnType> {
  const { userId } = await auth();
  if (!userId) return { owns: false, ownerName: "" }; // not signed in → definitely not owner

  const [row] = await db
    .select({ ownerId: documents.ownerId })
    .from(documents)
    .where(eq(documents.id, docId));

  const [ownerName] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, row.ownerId));

  // row is undefined if the doc doesn't exist
  const owns = row?.ownerId === userId;
  const name = ownerName.name;

  return { owns, ownerName: name! };
}
