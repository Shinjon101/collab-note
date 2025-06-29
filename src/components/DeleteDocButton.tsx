"use client";
import { useRouter } from "next/navigation";
import React, { useTransition, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { deleteDocument } from "../../actions/deleteDocument";
import { toast } from "sonner";

type Props = {
  id: string; // document ID
};

const DeleteDocButton = ({ id }: Props) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleDelete = () => {
    startTransition(async () => {
      try {
        setOpen(false);
        await deleteDocument(id);
        toast.success("Note deleted.");
        router.push("/");
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Error deleting document"
        );
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button asChild variant="destructive" className="cursor-pointer">
        <DialogTrigger>Delete</DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this document?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. It will permanently remove the
            document and every collaborator’s access.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending ? "Deleting…" : "Delete"}
          </Button>

          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDocButton;
