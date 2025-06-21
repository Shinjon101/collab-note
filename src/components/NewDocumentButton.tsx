"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { createDocument } from "../../actions/createDocument";

const NewDocumentButton = () => {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      className="cursor-pointer"
      onClick={() => {
        startTransition(() => {
          createDocument();
        });
      }}
      disabled={isPending}
    >
      {isPending ? "Creating..." : "New Document"}
    </Button>
  );
};

export default NewDocumentButton;
