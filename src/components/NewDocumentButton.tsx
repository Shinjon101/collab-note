"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { createDocument } from "../../actions/createDocument";
import { toast } from "sonner";
import { SignUpButton, useAuth } from "@clerk/nextjs";

const NewDocumentButton = () => {
  const [isPending, startTransition] = useTransition();
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return (
      <SignUpButton mode="modal">
        <Button className="mb-5 font-bold max-w-xs h-auto py-3">Sign up</Button>
      </SignUpButton>
    );
  }

  return (
    <Button
      className="cursor-pointer mb-5 font-bold"
      onClick={() => {
        startTransition(() => {
          try {
            createDocument();

            toast.success("New Note created !");
          } catch (_err) {
            toast.error("Error creating Note");
          }
        });
      }}
      disabled={isPending}
    >
      {isPending ? "Creating..." : "New Note"}
    </Button>
  );
};

export default NewDocumentButton;
