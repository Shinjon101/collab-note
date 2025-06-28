"use client";
import { useRoom, useSelf } from "@liveblocks/react";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useTheme } from "next-themes";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCreateBlockNote } from "@blocknote/react";
import stringToColor from "@/lib/stringToColor";
import type { BlockNoteEditor } from "@blocknote/core";
import { updateContent } from "../../actions/updateContent";

const Editor = () => {
  const room = useRoom();
  const userInfo = useSelf((me) => me.info);
  const { theme } = useTheme();

  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<LiveblocksYjsProvider | null>(null);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);

    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc.destroy();
      yProvider.destroy();
    };
  }, [room]);

  const editor: BlockNoteEditor | null = useCreateBlockNote(
    doc && provider && userInfo
      ? {
          collaboration: {
            provider,
            fragment: doc.getXmlFragment("document-store"),
            user: {
              name: userInfo.name ?? "Anonymous",
              color: stringToColor(userInfo.email ?? "anon@example.com"),
            },
          },
        }
      : undefined
  );

  useEffect(() => {
    //auto save to DB every 35 seconds
    if (!doc || !room) return;

    setInterval(async () => {
      try {
        const encoded = Y.encodeStateAsUpdate(doc);
        const base64 = Buffer.from(encoded).toString("base64");

        await updateContent(room.id, base64);
        console.log("Auto-saved content for:", room.id);
      } catch (err) {
        console.error("Autosave error:", err);
      }
    }, 35_000);
  });
  if (!doc || !provider || !userInfo || !editor) return null;

  return (
    <section className="max-w-7xl mx-auto min-h-screen pt-8">
      <BlockNoteView
        editor={editor}
        editable={userInfo.role !== "read"}
        theme={theme === "dark" ? "dark" : "light"}
        className="full-height-editor"
      />
    </section>
  );
};

export default Editor;
