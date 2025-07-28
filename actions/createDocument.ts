"use server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { documents, users, userRooms } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createDocument() {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, reason: "unauthenticated" };
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return { success: false, reason: "missing_clerk_user" };
  }
  try {
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
      .onConflictDoNothing();

    const [doc] = await db
      .insert(documents)
      .values({
        title: "New Note",
        ownerId: userId,
      })
      .returning();

    await db.insert(userRooms).values({
      userId: userId,
      roomId: doc.id,
      role: "edit",
    });

    console.log("Document created:", doc.id);

    revalidatePath("/");
    redirect(`/documents/${doc.id}`);
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
}
