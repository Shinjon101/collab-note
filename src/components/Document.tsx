"use client";
import React, { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { updateTitle } from "../../actions/updateTitle";
import { getTitle } from "../../actions/getTitle";
import Editor from "./Editor";
import { useIsOwner } from "@/hooks/useIsOwner";
import DeleteDocButton from "./DeleteDocButton";

interface Props {
  id: string;
}

const Document = ({ id }: Props) => {
  const [input, setInput] = useState("");
  const [isUpdating, startTransition] = useTransition();
  const { isOwner, isLoading } = useIsOwner(id);

  const fetchTitle = async () => {
    const dbTitle = await getTitle(id);
    setInput(dbTitle);
  };

  useEffect(() => {
    fetchTitle();
  }, []);

  const updateDocTitle = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      startTransition(async () => {
        await updateTitle(id, input);
        setInput("");
      });
    }
  };

  return (
    <div>
      <div>
        <form className="flex justify-between gap-10" onSubmit={updateDocTitle}>
          {/* update title */}
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update"}
          </Button>
          {/* if owner ? */}
          {!isLoading && isOwner && <DeleteDocButton id={id} />}
        </form>
      </div>

      <div>
        {/* MangeUsers */}
        {/* Avatars */}
      </div>

      <hr className="pb-10 mt-10" />
      <Editor />
    </div>
  );
};

export default Document;
