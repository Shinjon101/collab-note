"use client";

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
import { Input } from "./ui/input";

type Props = {
  id: string; // document ID
};

const InviteButton = ({ id }: Props) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button asChild variant="outline" className="cursor-pointer">
        <DialogTrigger>Invite</DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Enter email and set role of user you want to invite.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInvite}>
          <Input
            type="email"
            placeholder="email"
            className="w-full"
            value={email}
          />
          <Button type="submit" disabled={!email || isPending}>
            {isPending ? "Inviting" : "Invite"}
          </Button>
          {/* some sort of switch or drop down to choose role: By default -> Viewer */}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteButton;
