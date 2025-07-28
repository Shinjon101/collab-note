// src/actions/getSharedDocs.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { userRooms, documents } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";

export async function getSharedDocs() {
  const { userId } = await auth();
  if (!userId) return [];

  const rows = await db
    .select({
      id: documents.id,
      title: documents.title,
    })
    .from(userRooms)
    .innerJoin(documents, eq(userRooms.roomId, documents.id))
    .where(and(eq(userRooms.userId, userId), ne(documents.ownerId, userId)));

  return rows;
}
