"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function addUser() {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, reason: "unauthenticated" };
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return { success: false, reason: "missing_clerk_user" };
  }

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
}
