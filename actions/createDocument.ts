"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { documents, users } from "@/db/schema";
import { redirect } from "next/navigation";

export async function createDocument() {
  const { userId } = await auth.protect();
  const clerkUser = await currentUser();

  try {
    // Create user if they don't exist (simple upsert)
    await db
      .insert(users)
      .values({
        id: userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress || "",
        name: clerkUser?.firstName || clerkUser?.username || "Anonymous",
      })
      .onConflictDoNothing(); // PostgreSQL - ignore if user already exists

    // Create the document
    const [doc] = await db
      .insert(documents)
      .values({
        title: "New Doc",
        ownerId: userId,
      })
      .returning();

    console.log("Document created:", doc.id);
    redirect(`/documents/${doc.id}`);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
