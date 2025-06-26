"use room";
import { useRoom, useSelf } from "@liveblocks/react";
import { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useTheme } from "next-themes";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCreateBlockNote } from "@blocknote/react";
import stringToColor from "@/lib/stringToColor";
import type { BlockNoteEditor } from "@blocknote/core";

type EditorProps = {
  doc: Y.Doc;
  provider: any;
  userInfo: {
    name: string;
    email: string;
    role: string;
  };
};

const BlockNote = ({ doc, provider, userInfo }: EditorProps) => {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const readOnly = userInfo.role === "read";

  const editor: BlockNoteEditor = useCreateBlockNote(
    useMemo(() => {
      return {
        collaboration: {
          provider,
          fragment: doc.getXmlFragment("document-store"),
          user: {
            name: userInfo.name,
            color: stringToColor(userInfo.email),
          },
        },
      };
    }, [provider, doc, userInfo])
  );

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

const Editor = () => {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const userInfo = useSelf((me) => me.info);

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

  if (!doc || !provider || !userInfo) return null;

  return (
    <section className="max-w-7xl mx-auto min-h-screen">
      <BlockNote
        doc={doc}
        provider={provider}
        userInfo={{
          name: userInfo.name ?? "Anonymous",
          email: userInfo.email ?? "anonymous@example.com",
          role: userInfo.role ?? "read",
        }}
      />
    </section>
  );
};

export default Editor;
