"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { documents, users, userRooms } from "@/db/schema";
import { redirect } from "next/navigation";

export async function createDocument() {
  const { userId } = await auth.protect();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) {
    throw new Error("Unauthorized or missing user data.");
  }

  try {
    // 1. Upsert user info
    await db
      .insert(users)
      .values({
        id: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name:
          clerkUser.firstName ||
          clerkUser.username ||
          clerkUser.lastName ||
          "Anonymous",
      })
      .onConflictDoNothing(); // If user already exists, skip

    // 2. Create the document
    const [doc] = await db
      .insert(documents)
      .values({
        title: "New Doc",
        ownerId: userId,
      })
      .returning();

    // 3. Link user to the room (document)
    await db.insert(userRooms).values({
      userId: userId,
      roomId: doc.id,
      role: "edit",
    });

    console.log("Document created:", doc.id);
    redirect(`/documents/${doc.id}`);
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
}
