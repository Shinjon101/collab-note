"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";

export const updateTitle = async (id: string, newTitle: string) => {
  const { userId } = await auth();

  if (!userId) throw new Error("not Autheticated");

  await db
    .update(documents)
    .set({ title: newTitle })
    .where(eq(documents.id, id));
};
