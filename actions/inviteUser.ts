"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import {
  users,
  userRooms,
  documentCollaborators,
  documents,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isOwner } from "./isOwner";
import { liveblocks } from "@/lib/liveblocks‑server";

export async function inviteUser(
  docId: string,
  email: string,
  role: "read" | "edit"
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Unauthorized" };

  const { owns, ownerName } = await isOwner(docId);
  if (!owns) return { ok: false, error: "Forbidden" };

  const [target] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));

  if (!target) return { ok: false, error: "User not found" };
  const targetId = target.id;

  const [existing] = await db
    .select()
    .from(userRooms)
    .where(and(eq(userRooms.userId, targetId), eq(userRooms.roomId, docId)));

  if (existing) return { ok: false, error: "User already invited" };

  await db.insert(userRooms).values({ userId: targetId, roomId: docId, role });
  await db
    .insert(documentCollaborators)
    .values({ userId: targetId, documentId: docId, role });

  const [docTitle] = await db
    .select({ titel: documents.title })
    .from(documents)
    .where(eq(documents.id, docId));

  const title = docTitle.titel;
  await liveblocks.broadcastEvent(`user:${targetId}:inbox`, {
    type: "INVITED_TO_DOCUMENT",
    docId,
    role,
    ownerName,
    title,
  });

  revalidatePath(`/documents/${docId}`, "page");
  return { ok: true };
}
