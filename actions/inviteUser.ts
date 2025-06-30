"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, userRooms, documentCollaborators } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isOwner } from "./isOwner";
import { liveblocks } from "@/lib/liveblocks‑server";

export async function inviteUser(
  docId: string,
  email: string,
  role: "read" | "edit"
): Promise<{ ok: true } | { ok: false; error: string }> {
  // Auth check
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Unauthorized" };

  // Owner check
  const { owns } = await isOwner(docId);
  if (!owns) return { ok: false, error: "Forbidden" };

  // Get user by email
  const [target] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));

  if (!target) return { ok: false, error: "User not found" };
  const targetId = target.id;

  // Check if already added
  const [existing] = await db
    .select()
    .from(userRooms)
    .where(and(eq(userRooms.userId, targetId), eq(userRooms.roomId, docId)));

  if (existing) return { ok: false, error: "User already invited" };

  // Add to tables
  await db.insert(userRooms).values({ userId: targetId, roomId: docId, role });
  await db
    .insert(documentCollaborators)
    .values({ userId: targetId, documentId: docId, role });

  /*   await liveblocks.broadcastEvent(`user:${targetId}`, {
    type: "INVITED_TO_DOCUMENT",
    docId: docId,
    role: role,
  }); */
  revalidatePath(`/documents/${docId}`, "page");
  return { ok: true };
}
