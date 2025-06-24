"use room";

import { useRoom, useSelf } from "@liveblocks/react";
import { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCreateBlockNote } from "@blocknote/react";
import stringToColor from "@/lib/stringToColor";

import type { BlockNoteEditor } from "@blocknote/core";

type EditorProps = {
  doc: Y.Doc;
  provider: any;
  darkMode: boolean;
  userInfo: {
    name: string;
    email: string;
  };
};

const BlockNote = ({ doc, provider, darkMode, userInfo }: EditorProps) => {
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
    <div className="relative z-0 max-w-5xl mx-auto">
      <BlockNoteView
        className="min-h-screen"
        editor={editor}
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
};

const Editor = () => {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);
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

  const style = `hover:text-white ${
    darkMode
      ? "text-gray-100 bg-gray-200 hover:bg-gray-100 hover:text-gray-700"
      : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
  }`;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 justify-end mb-10">
        <Button className={style} onClick={() => setDarkMode((prev) => !prev)}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>

      <BlockNote
        doc={doc}
        provider={provider}
        darkMode={darkMode}
        userInfo={{
          name: userInfo.name ?? "Anonymous",
          email: userInfo.email ?? "anonymous@example.com",
        }}
      />
    </div>
  );
};

export default Editor;
