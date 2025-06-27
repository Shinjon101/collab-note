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

interface Props {
  id: string;
  isOwner: boolean;
}

const Document = ({ id, isOwner }: Props) => {
  const [input, setInput] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [isUpdating, startTransition] = useTransition();

  const fetchTitle = async () => {
    const dbTitle = await getTitle(id);
    setInput(dbTitle);
    setOriginalTitle(dbTitle);
  };

  useEffect(() => {
    fetchTitle();
  }, []);

  const updateDocTitle = (e: FormEvent) => {
    e.preventDefault();

    const trimmedInput = input.trim();

    // Check if input is empty
    if (!trimmedInput) {
      toast.error("Error!", {
        description: "Title cannot be empty",
      });
      return;
    }

    // Check if title actually changed
    if (trimmedInput === originalTitle) {
      toast.info("No changes", {
        description: "Title is already up to date",
      });
      return;
    }

    startTransition(async () => {
      try {
        await updateTitle(id, trimmedInput);
        setOriginalTitle(trimmedInput);
        toast.success("Success", {
          description: "Document name updated",
        });
      } catch (err) {
        toast.error("Error!", {
          description: `Error: ${err}`,
        });
      }
    });
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = input.trim() !== originalTitle;

  return (
    <div>
      <div>
        <form className="flex justify-between gap-10" onSubmit={updateDocTitle}>
          {/* update title */}
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Document title"
          />
          <Button
            type="submit"
            disabled={isUpdating || !hasUnsavedChanges}
            className="cursor-pointer"
          >
            {isUpdating ? "Updating..." : "Update"}
          </Button>
          {isOwner && (
            <>
              <DeleteDocButton id={id} />
              <InviteUserButton docId={id} />
            </>
          )}
        </form>
      </div>
      <hr className="mb-5 mt-10" />
      <div className="mb-10">
        <ManageUser />
      </div>
      <Editor />
    </div>
  );
};

export default Document;
