"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { createDocument } from "../../actions/createDocument";
import { toast } from "sonner";

const NewDocumentButton = () => {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      className="cursor-pointer mb-5"
      onClick={() => {
        startTransition(() => {
          try {
            createDocument();
            toast.success("New Document created !");
          } catch (_err) {
            toast.error("Error creating document");
          }
        });
      }}
      disabled={isPending}
    >
      {isPending ? "Creating..." : "New Document"}
    </Button>
  );
};

export default NewDocumentButton;
