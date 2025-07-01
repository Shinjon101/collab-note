"use client";

import React, {
  FormEvent,
  use,
  useEffect,
  useState,
  useTransition,
} from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { updateTitle } from "../../actions/updateTitle";
import { getTitle } from "../../actions/getTitle";
import Editor from "./Editor";
import DeleteDocButton from "./DeleteDocButton";
import InviteUserButton from "./InviteButton";
import ManageUser from "./ManageUser";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { useEventListener } from "@liveblocks/react/suspense";
import { useSelf } from "@liveblocks/react";
import LeaveRoomButton from "./LeaveRoomButton";
import { log } from "console";

interface Props {
  id: string; // document / room id
  isOwner: boolean;
  userId: string;
}

const Document = ({ id, isOwner, userId }: Props) => {
  const userInfo = useSelf((me) => me.info);
  const router = useRouter();
  const [role, setRole] = useState<"read" | "edit">(
    userInfo?.role as "read" | "edit"
  );
  /* ─── Listen for doc events ────────── */
  useEventListener(({ event }) => {
    if (event.type === "DOCUMENT_DELETED") {
      if (event.userId !== userId) {
        toast.error("This document was deleted by its owner.");
      }
      router.push("/");
    }

    if (event.type === "LEFT_DOC") {
      if (event.userId !== userId) {
        toast.info(`${event.userName} left the room.`);
      }
      router.refresh();
    }
    if (event.type === "DOCUMENT_UPDATED") {
      if (event.userId !== userId) {
        toast.info("Title updated by a member");
      }
      setInput(event.title);
      setOriginalTitle(event.title);
      router.refresh();
    }
    if (event.type === "REMOVED_USER") {
      if (event.targetId === userId) {
        toast.error("Removed by owner");
        router.push("/");
        router.refresh();
      } else {
        toast.info(`${event.targetName} removed by Owner`);
      }
    }
    if (event.type === "UPDATE_ROLE" && event.targetId === userId) {
      toast.info(
        event.newRole === "read"
          ? "You are now a viewer"
          : "You are now an editor"
      );
      setRole(event.newRole);
      router.refresh();
    }
  });

  const [input, setInput] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [isUpdating, startTransition] = useTransition();

  useEffect(() => {
    (async () => {
      const dbTitle = await getTitle(id);
      setInput(dbTitle);
      setOriginalTitle(dbTitle);
    })();
  }, [id]);

  const updateDocTitle = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      toast.error("Error!", { description: "Title cannot be empty" });
      return;
    }
    if (trimmed === originalTitle) {
      toast.info("No changes", { description: "Title is already up to date" });
      return;
    }
    startTransition(async () => {
      await updateTitle(id, trimmed);
      setOriginalTitle(trimmed);
      toast.success("Success", { description: "Title updated" });
    });
  };

  const hasUnsavedChanges = input.trim() !== originalTitle;

  return (
    <>
      {/* Title + actions */}
      <header className="mb-6">
        <form
          aria-label="Update document title"
          onSubmit={updateDocTitle}
          className="flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <div className="flex w-full gap-2">
            <Input
              aria-label="Document title"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
            />
            <Button
              aria-label="Save title"
              type="submit"
              disabled={isUpdating || !hasUnsavedChanges}
            >
              {isUpdating ? "Updating…" : "Update"}
            </Button>

            {!isOwner && <LeaveRoomButton docId={id} userId={userId} />}
          </div>

          {/* owner‑only buttons */}
          {isOwner && (
            <div className="flex gap-2">
              <DeleteDocButton id={id} />
              <InviteUserButton docId={id} />
            </div>
          )}
        </form>
      </header>

      <hr className="mt-3 mb-5" />

      <section className="mb-10" aria-label="Manage collaborators">
        <ManageUser />
      </section>

      <main aria-label="Document editor">
        <Editor readOnly={role === "read"} />
      </main>
    </>
  );
};

export default Document;
