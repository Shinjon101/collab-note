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
      console.log("No Clerk user found");
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
      roomId = body.roomId || body.room; // Support both "roomId" and "room"
      console.log("Requested room:", roomId);
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response("Invalid request body", { status: 400 });
    }

    if (!roomId) {
      console.log("No roomId provided");
      return new Response("Room ID required", { status: 400 });
    }

    // Handle special inbox room: user:{userId}:inbox
    const isInboxRoom = roomId.startsWith("user:") && roomId.endsWith(":inbox");
    if (isInboxRoom) {
      const session = liveblocks.prepareSession(userId, {
        userInfo: {
          name: userName,
          email: userEmail,
          avatar: userAvatar,
          role: "read",
        },
      });

      session.allow(roomId, session.FULL_ACCESS); // grant read/write to own inbox
      const { status, body } = await session.authorize();
      console.log("Authorized inbox room for user:", userId);
      return new Response(body, { status });
    }

    // Otherwise — it's a document room

    // Check if document exists
    const [roomDoc] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, roomId));

    if (!roomDoc) {
      console.log("Room not found in database:", roomId);
      return new Response("Room not found", { status: 404 });
    }

    // Check if user has access
    const isOwner = roomDoc.ownerId === userId;

    let hasAccess = isOwner;

    if (!hasAccess) {
      const userRoomAccess = await db
        .select()
        .from(userRooms)
        .where(and(eq(userRooms.userId, userId), eq(userRooms.roomId, roomId)));

      hasAccess = userRoomAccess.length > 0;
    }

    if (!hasAccess) {
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
      return new Response("Access denied", { status: 403 });
    }

    // Determine role
    let role: "read" | "edit" | null = null;

    if (isOwner) {
      role = "edit";
    } else {
      const [ur] = await db
        .select({ role: userRooms.role })
        .from(userRooms)
        .where(and(eq(userRooms.userId, userId), eq(userRooms.roomId, roomId)));

      if (ur) {
        role = ur.role as "read" | "edit";
      } else {
        const [col] = await db
          .select({ role: documentCollaborators.role })
          .from(documentCollaborators)
          .where(
            and(
              eq(documentCollaborators.userId, userId),
              eq(documentCollaborators.documentId, roomId)
            )
          );

        if (col) {
          role = col.role as "read" | "edit";
        }
      }
    }

    if (!role) {
      return new Response("Access denied", { status: 403 });
    }

    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name: userName,
        email: userEmail,
        avatar: userAvatar,
        role,
      },
    });

    if (role === "edit") {
      session.allow(roomId, session.FULL_ACCESS);
    } else {
      session.allow(roomId, session.READ_ACCESS);
    }

    const { status, body } = await session.authorize();
    console.log("Liveblocks authorization successful:", status);
    return new Response(body, { status });
  } catch (error) {
    console.error("Auth endpoint error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
