"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";
import type { BlockNoteEditor } from "@blocknote/core";

interface EditorContextType {
  editor: BlockNoteEditor | null;
  setEditor: (editor: BlockNoteEditor) => void;
}

const EditorContext = createContext<EditorContextType>({} as EditorContextType);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

  return (
    <EditorContext.Provider value={{ editor, setEditor }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
