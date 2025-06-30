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
import { liveblocks } from "@/lib/liveblocks‑server";

/* ──────────────────────────────────────────────
 *  isOwner ─ check if current user owns the doc
 * ────────────────────────────────────────────── */
export async function isOwner(docId: string): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  const [row] = await db
    .select({ ownerId: documents.ownerId })
    .from(documents)
    .where(eq(documents.id, docId));

  return row?.ownerId === userId;
}

/* ──────────────────────────────────────────────
 *  getRoomMembers ─ roster for the sidebar/dialog
 * ────────────────────────────────────────────── */
export async function getRoomMembers(docId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [doc] = await db
    .select({ ownerId: documents.ownerId })
    .from(documents)
    .where(eq(documents.id, docId));

  const ownerId = doc?.ownerId;

  const members = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: userRooms.role,
    })
    .from(userRooms)
    .innerJoin(users, eq(users.id, userRooms.userId))
    .where(eq(userRooms.roomId, docId));

  return { isOwner: ownerId === userId, ownerId, members };
}

/* ──────────────────────────────────────────────
 *  updateUserRole ─ owner updates read/edit role
 * ────────────────────────────────────────────── */
export async function updateUserRole(
  docId: string,
  targetId: string,
  newRole: "read" | "edit"
) {
  if (!(await isOwner(docId))) throw new Error("Forbidden");

  await db
    .update(userRooms)
    .set({ role: newRole })
    .where(and(eq(userRooms.roomId, docId), eq(userRooms.userId, targetId)));

  revalidatePath(`/documents/${docId}`, "page");
  await liveblocks.broadcastEvent(docId, {
    type: "UPDATE_ROLE",
    targetId,
    newRole,
  });
}

/* ──────────────────────────────────────────────
 *  removeUserFromRoom ─ owner kicks a collaborator
 * ────────────────────────────────────────────── */
export async function removeUserFromRoom(docId: string, targetId: string) {
  if (!(await isOwner(docId))) throw new Error("Forbidden");

  await db
    .delete(userRooms)
    .where(and(eq(userRooms.roomId, docId), eq(userRooms.userId, targetId)));

  await db
    .delete(documentCollaborators)
    .where(
      and(
        eq(documentCollaborators.documentId, docId),
        eq(documentCollaborators.userId, targetId)
      )
    );

  const [targetUser] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, targetId));

  const targetName = targetUser.name;
  if (!targetName) throw new Error("Username not found");

  revalidatePath(`/documents/${docId}`, "page");
  await liveblocks.broadcastEvent(docId, {
    type: "REMOVED_USER",
    targetId,
    targetName,
  });
}
/* ──────────────────────────────────────────────
 *
 * ────────────────────────────────────────────── */
export async function leaveRoom(docId: string, userId: string) {
  await db
    .delete(userRooms)
    .where(and(eq(userRooms.roomId, docId), eq(userRooms.userId, userId)));

  await db
    .delete(documentCollaborators)
    .where(
      and(
        eq(documentCollaborators.documentId, docId),
        eq(documentCollaborators.userId, userId)
      )
    );
  const [user] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, userId));

  const userName = user.name;
  if (!userName) throw new Error("Username not found");

  await liveblocks.broadcastEvent(docId, {
    type: "LEFT_DOC",
    userId,
    userName,
  });
}
