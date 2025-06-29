"use client";

import React, { FormEvent, useEffect, useState, useTransition } from "react";
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
import { useEventListener } from "@liveblocks/react";

interface Props {
  id: string; // document / room id
  isOwner: boolean;
}

const Document = ({ id, isOwner }: Props) => {
  const router = useRouter();

  /* ─── Listen for owner‑deletes‑doc event ────────── */
  useEventListener(({ event }) => {
    if (event.type === "DOCUMENT_DELETED") {
      toast.error("This document was deleted by its owner.");
      router.push("/");
    }
    if (event.type === "DOCUMENT_UPDATED") {
      toast.info("Title updated by a member");
      setInput(event.title);
      setOriginalTitle(event.title);
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
        <Editor />
      </main>
    </>
  );
};

export default Document;
