"use client";

import { useEditor } from "../providers/EditorContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { summarizeDocument } from "../../../actions/summarizeDocument";
import { toast } from "sonner";
import { AlertCircleIcon, BotMessageSquare } from "lucide-react";
import React, { useState } from "react";

interface Props {
  documentId: string;
}

const SummarizeButton = ({ documentId }: Props) => {
  const { editor } = useEditor();

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [open, setOpen] = useState(false);

  const onOpenChange = async (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(false);
      return;
    }

    const selectedText = editor?.getSelectedText()?.trim();

    if (!selectedText) {
      toast.error("Please select some text to summarize.");
      return;
    }

    setOpen(true);
    setLoading(true);
    setSummary("");

    try {
      const result = await summarizeDocument(selectedText, documentId);
      setSummary(result.summary);
    } catch (error: any) {
      toast.error("Summarization failed", {
        description: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Button asChild variant="outline" disabled={loading}>
        <DialogTrigger>
          <BotMessageSquare className="mr-2 h-4 w-4" />
          {loading ? "Summarizing..." : "Summarize"}
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Summary</DialogTitle>
          <DialogDescription>
            Get a concise summary of your selected content powered by AI.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-2 mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        ) : summary ? (
          <div className="relative pb-10 bg-secondary rounded-2xl">
            <p className="mt-4 px-3 whitespace-pre-wrap text-sm">{summary}</p>
            <Button
              size="sm"
              variant="outline"
              className="absolute bottom-2 right-2"
              onClick={() => {
                navigator.clipboard.writeText(summary);
                toast.success("Summary copied to clipboard");
              }}
            >
              Copy
            </Button>
          </div>
        ) : (
          <Alert variant="destructive" className="mt-4">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Summarization failed</AlertTitle>
            <AlertDescription>Try again later.</AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SummarizeButton;
