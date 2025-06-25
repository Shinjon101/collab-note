"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import {
  users,
  userRooms,
  documentCollaborators,
  documents,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isOwner } from "./isOwner";

export async function inviteUser(
  docId: string,
  email: string,
  role: "read" | "edit"
): Promise<{ ok: true } | { ok: false; error: string }> {
  /* 1 ─── authenticate caller ───────────────────────────── */
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Unauthorized" };

  /* 2 ─── ensure caller is owner ─────────────────────────── */
  const owner = await isOwner(docId);
  if (!owner) return { ok: false, error: "Forbidden" };

  /* 3 ─── find the target user by email ──────────────────── */
  const [target] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));

  if (!target) return { ok: false, error: "User not found in database" };

  const targetId = target.id;

  /* 4 ─── insert into access-control tables (idempotent) ── */
  await db
    .insert(userRooms)
    .values({ userId: targetId, roomId: docId, role })
    .onConflictDoNothing();

  await db
    .insert(documentCollaborators)
    .values({ userId: targetId, documentId: docId, role })
    .onConflictDoNothing();

  /* 5 ─── revalidate RSC so collaborator lists refresh ───── */
  revalidatePath(`/documents/${docId}`, "page");

  return { ok: true };
}
