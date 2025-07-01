"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db";
import { documents, userRooms, documentCollaborators } from "@/db/schema";
import { eq } from "drizzle-orm";
import { liveblocks } from "@/lib/liveblocks‑server";

export const deleteDocument = async (docId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  // verify the caller is the owner
  const [doc] = await db
    .select({ ownerId: documents.ownerId })
    .from(documents)
    .where(eq(documents.id, docId));
  if (!doc || doc.ownerId !== userId) throw new Error("Forbidden");

  /* ─── SQL cleanup ───────────────────────────────────────────── */
  await db
    .delete(documentCollaborators)
    .where(eq(documentCollaborators.documentId, docId));
  await db.delete(userRooms).where(eq(userRooms.roomId, docId));
  await db.delete(documents).where(eq(documents.id, docId));

  /* ─── Real‑time broadcast ──────────────────────────────────── */
  // Instantly push a message to every tab that is still in <room id = docId>
  await liveblocks.broadcastEvent(docId, {
    type: "DOCUMENT_DELETED",
    userId,
  });
};
