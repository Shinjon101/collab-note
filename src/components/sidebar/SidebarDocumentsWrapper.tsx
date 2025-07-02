"use client";

import { RoomProvider, useEventListener } from "@liveblocks/react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import SidebarDocuments from "./SideBarDocuments";
import { getSharedDocs } from "../../../actions/getSharedDocs";
import { toast } from "sonner";

interface Props {
  initialCreated: { id: string; title: string | null }[];
  initialShared: { id: string; title: string | null }[];
  userId: string;
}

function SidebarRealtime({ initialCreated, initialShared, userId }: Props) {
  const [createdDocs, setCreatedDocs] = useState(initialCreated);
  const [sharedDocs, setSharedDocs] = useState(initialShared);

  useEffect(() => setCreatedDocs(initialCreated), [initialCreated]);
  useEffect(() => setSharedDocs(initialShared), [initialShared]);

  const refetchShared = useCallback(async () => {
    const docs = await getSharedDocs();
    setSharedDocs(docs);
  }, []);

  useEventListener(({ event }) => {
    if (event.type === "INVITED_TO_DOCUMENT") {
      refetchShared();
      const role = event.role === "read" ? "viewer" : "editor";
      toast.info("Invitation alert!", {
        description: `${event.ownerName} invited you as a ${role} to ${event.title}`,
      });
    }
    if (event.type === "REMOVED_USER") {
      if (event.targetId === userId) {
        refetchShared();
      }
    }
  });

  return <SidebarDocuments createdDocs={createdDocs} sharedDocs={sharedDocs} />;
}

export default function SidebarDocumentsWrapper({
  initialCreated,
  initialShared,
}: Props) {
  const { user } = useUser();
  if (!user?.id) return null;

  return (
    <RoomProvider
      id={`user:${user.id}:inbox`}
      initialPresence={{ cursor: null }}
    >
      <SidebarRealtime
        initialCreated={initialCreated}
        initialShared={initialShared}
        userId={user.id}
      />
    </RoomProvider>
  );
}
