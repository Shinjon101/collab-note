// src/actions/deleteDocument.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { documents, userRooms, documentCollaborators } from "@/db/schema";
import { eq } from "drizzle-orm";

export const deleteDocument = async (docId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Ensure caller owns the doc
  const [doc] = await db
    .select({ ownerId: documents.ownerId })
    .from(documents)
    .where(eq(documents.id, docId));

  if (!doc || doc.ownerId !== userId) throw new Error("Forbidden");

  // Remove related rows first (ON DELETE CASCADE also ok)
  await db
    .delete(documentCollaborators)
    .where(eq(documentCollaborators.documentId, docId));
  await db.delete(userRooms).where(eq(userRooms.roomId, docId));

  // Finally delete the document
  await db.delete(documents).where(eq(documents.id, docId));
};
