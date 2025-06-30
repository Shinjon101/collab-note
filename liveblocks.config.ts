// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      // Example, real-time cursor coordinates
      cursor: { x: number; y: number } | null;
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      // Example, a conflict-free list
      // animals: LiveList<string>;
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        email: string;
        name: string;
        avatar: string;
        role: string;
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent:
      | { type: "DOCUMENT_DELETED" }
      | { type: "LEFT_DOC"; userId: string; userName: string }
      | {
          type: "INVITED_TO_DOCUMENT";
          docId: string;
          role: "read" | "edit";
        }
      | { type: "DOCUMENT_UPDATED"; title: string }
      | { type: "REMOVED_USER"; targetId: string; targetName: string }
      | { type: "UPDATE_ROLE"; targetId: string; newRole: "read" | "edit" };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      // Example, attaching coordinates to a thread
      // x: number;
      // y: number;
    };

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      // Example, rooms with a title and url
      // title: string;
      // url: string;
    };
  }
}

export {};
