// src/app/api/auth-endpoint/route.ts
import { Liveblocks } from "@liveblocks/node";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { userRooms, documents, documentCollaborators } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(req: Request) {
  try {
    console.log("Auth endpoint hit");

    const { userId } = await auth();
    if (!userId) {
      console.log("No userId found");
      return new Response("Unauthorized", { status: 401 });
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      console.log("No clerk user found");
      return new Response("User not found", { status: 404 });
    }

    const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
    const userAvatar = clerkUser.imageUrl;
    const userName =
      clerkUser.firstName ||
      clerkUser.username ||
      clerkUser.emailAddresses[0]?.emailAddress ||
      "Anonymous";

    // Parse request body
    let roomId;
    try {
      const body = await req.json();
      roomId = body.roomId || body.room; // Support both roomId and room
      console.log("Requested room:", roomId);
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response("Invalid request body", { status: 400 });
    }

    if (!roomId) {
      console.log("No roomId provided");
      return new Response("Room ID required", { status: 400 });
    }

    // Verify room exists
    const [roomDoc] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, roomId));

    if (!roomDoc) {
      console.log("Room not found in database:", roomId);
      return new Response("Room not found", { status: 404 });
    }

    // Check user access - check if user is owner OR has access via userRooms OR documentCollaborators
    const isOwner = roomDoc.ownerId === userId;

    let hasAccess = isOwner;

    if (!hasAccess) {
      // Check userRooms table
      const userRoomAccess = await db
        .select()
        .from(userRooms)
        .where(and(eq(userRooms.userId, userId), eq(userRooms.roomId, roomId)));

      hasAccess = userRoomAccess.length > 0;
    }

    if (!hasAccess) {
      // Check documentCollaborators table as fallback
      const collaboratorAccess = await db
        .select()
        .from(documentCollaborators)
        .where(
          and(
            eq(documentCollaborators.userId, userId),
            eq(documentCollaborators.documentId, roomId)
          )
        );

      hasAccess = collaboratorAccess.length > 0;
    }

    if (!hasAccess) {
      console.log("Access denied for user:", userId, "room:", roomId);
      console.log(
        "User is not owner, not in userRooms, and not in documentCollaborators"
      );
      return new Response("Access denied", { status: 403 });
    }

    let role: "read" | "edit" | null = null;

    if (roomDoc.ownerId === userId) {
      role = "edit"; // owner has full rights
    } else {
      const [ur] = await db
        .select({ role: userRooms.role })
        .from(userRooms)
        .where(and(eq(userRooms.userId, userId), eq(userRooms.roomId, roomId)));
      if (ur) role = ur.role as "read" | "edit";
      else {
        // fallback to documentCollaborators
        const [col] = await db
          .select({ role: documentCollaborators.role })
          .from(documentCollaborators)
          .where(
            and(
              eq(documentCollaborators.userId, userId),
              eq(documentCollaborators.documentId, roomId)
            )
          );
        if (col) role = col.role as "read" | "edit";
      }
    }

    if (!role) {
      return new Response("Access denied", { status: 403 });
    }

    console.log(
      "Access granted - User:",
      userId,
      "Room:",
      roomId,
      "IsOwner:",
      isOwner
    );

    console.log("Creating Liveblocks session for user:", userId, role);

    // Create Liveblocks session with permissions
    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name: userName,
        email: userEmail,
        avatar: userAvatar,
        role: role,
      },
    });
    if (role === "edit") {
      session.allow(roomId, session.FULL_ACCESS); // read + write
    } else {
      session.allow(roomId, session.READ_ACCESS); // read-only
    }

    const { status, body } = await session.authorize();

    console.log("Liveblocks authorization successful:", status);
    return new Response(body, { status });
  } catch (error) {
    console.error("Auth endpoint error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
