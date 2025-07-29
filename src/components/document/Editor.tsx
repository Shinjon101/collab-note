"use client";

import { useRoom, useSelf } from "@liveblocks/react";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useTheme } from "next-themes";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCreateBlockNote } from "@blocknote/react";
import type { BlockNoteEditor } from "@blocknote/core";
import * as Y from "yjs";
import stringToColor from "@/lib/stringToColor";
import { useEffect, useMemo, useState } from "react";
import { useEditor } from "../providers/EditorContext";

type BlockNoteProps = {
  doc: Y.Doc;
  provider: LiveblocksYjsProvider;
  readOnly: boolean;
  userInfo: {
    name: string;
    email: string;
  };
};

type EditorWrapperProps = {
  readOnly: boolean;
};

const BlockNote = ({ doc, provider, readOnly, userInfo }: BlockNoteProps) => {
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  const editor: BlockNoteEditor = useCreateBlockNote(
    useMemo(
      () => ({
        collaboration: {
          provider,
          fragment: doc.getXmlFragment("document-store"),
          user: {
            name: userInfo.name,
            color: stringToColor(userInfo.email),
          },
        },
      }),
      [provider, doc, userInfo]
    )
  );

  const { setEditor } = useEditor();

  useEffect(() => {
    if (editor) {
      setEditor(editor);
    }
  }, [editor]);

  return (
    <div className="min-h-screen pt-8">
      <BlockNoteView
        editable={!readOnly}
        editor={editor}
        theme={darkMode ? "dark" : "light"}
        className="full-height-editor"
      />
    </div>
  );
};

export default function Editor({ readOnly }: EditorWrapperProps) {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<LiveblocksYjsProvider | null>(null);
  const userInfo = useSelf((me) => me.info);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);

    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yProvider.destroy();
      yDoc.destroy();
    };
  }, [room]);

  if (!doc || !provider || !userInfo) return null;

  return (
    <section className="max-w-7xl mx-auto min-h-screen">
      <BlockNote
        doc={doc}
        provider={provider}
        readOnly={readOnly}
        userInfo={{
          name: userInfo.name ?? "Anonymous",
          email: userInfo.email ?? "anonymous@example.com",
        }}
      />
    </section>
  );
}
