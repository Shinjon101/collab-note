// src/actions/getSharedDocs.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { userRooms, documents } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";

/**
 * Returns docs shared with the current user
 * (documents where the user appears in user_rooms
 *  but is NOT the owner).
 */
export async function getSharedDocs() {
  const { userId } = await auth();
  if (!userId) return [];

  // join user_rooms → documents and exclude owner-owned docs
  const rows = await db
    .select({
      id: documents.id,
      title: documents.title,
    })
    .from(userRooms)
    .innerJoin(documents, eq(userRooms.roomId, documents.id))
    .where(
      and(
        eq(userRooms.userId, userId), // user has entry in user_rooms
        ne(documents.ownerId, userId) // but is not the owner
      )
    );

  return rows;
}
