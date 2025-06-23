"use server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getTitle(id: string): Promise<string> {
  const result = await db
    .select({ title: documents.title })
    .from(documents)
    .where(eq(documents.id, Number(id)));

  return result[0]?.title || "";
}
