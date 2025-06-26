"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const updateTitle = async (id: string, newTitle: string) => {
  const { userId } = await auth();

  if (!userId) throw new Error("not Autheticated");

  await db
    .update(documents)
    .set({ title: newTitle })
    .where(eq(documents.id, id));

  revalidatePath("/");
  revalidatePath(`/documents/${id}`);
};
