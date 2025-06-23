"use client";

import { useCreateBlockNoteWithLiveblocks } from "@liveblocks/react-blocknote";
import { BlockNoteView } from "@blocknote/mantine";

export function Editor() {
  const editor = useCreateBlockNoteWithLiveblocks({});

  return (
    <div className="w-full max-w-5xl px-5 mt-10">
      <BlockNoteView
        editor={editor}
        className="border rounded-lg p-4 shadow-sm bg-white"
      />
    </div>
  );
}
