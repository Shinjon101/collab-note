"use server";

import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";

export const getUserDocs = async () => {
  const { userId } = await auth();

  if (!userId) return [];

  const docs = await db.query.documents.findMany({
    where: (docs, { eq }) => eq(docs.ownerId, userId),
    orderBy: (docs, { desc }) => [desc(docs.createdAt)],
  });

  return docs;
};
