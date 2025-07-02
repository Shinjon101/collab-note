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
import { Button } from "../ui/button";
import { leaveRoom } from "../../../actions/roomActions";
import { toast } from "sonner";

type Props = {
  docId: string; // document ID
  userId: string;
};

const LeaveRoomButton = ({ docId, userId }: Props) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleDelete = () => {
    startTransition(async () => {
      try {
        setOpen(false);
        await leaveRoom(docId, userId);
        toast.success("Left room");
        router.push("/");
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Error leaving document"
        );
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button asChild variant="destructive" className="cursor-pointer">
        <DialogTrigger>Leave</DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave this note?</DialogTitle>
          <DialogDescription>
            are you sure you want to leave this note ?
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
            {isPending ? "Leaving…" : "Leave"}
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

export default LeaveRoomButton;
