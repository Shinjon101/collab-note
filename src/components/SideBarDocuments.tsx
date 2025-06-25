"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarDocumentsProps {
  createdDocs: {
    id: string;
    title: string | null;
  }[];
  sharedDocs: {
    id: string;
    title: string | null;
  }[];
}

export default function SidebarDocuments({
  createdDocs,
  sharedDocs,
}: SidebarDocumentsProps) {
  const pathname = usePathname();

  const renderDocLink = (doc: { id: string; title: string | null }) => {
    const isActive = pathname === `/documents/${doc.id}`;
    return (
      <Link
        key={doc.id}
        href={`/documents/${doc.id}`}
        className={`border py-1 rounded-md text-center px-5 max-w-[150px] truncate overflow-hidden ${
          isActive ? "bg-gray-300 font-bold border-black" : "border-gray-400"
        }`}
      >
        {doc.title || "Untitled"}
      </Link>
    );
  };

  return (
    <div className="mt-2 space-y-4 w-full flex flex-col items-center">
      <div className="w-full flex flex-col items-center space-y-2">
        <p className="text-xs font-medium text-gray-600">Created by me</p>
        {createdDocs.length ? (
          createdDocs.map(renderDocLink)
        ) : (
          <p className="text-sm text-gray-400">No documents yet.</p>
        )}
      </div>

      <div className="w-full flex flex-col items-center space-y-2 border-t pt-4">
        <p className="text-xs font-medium text-gray-600">Shared with me</p>
        {sharedDocs.length ? (
          sharedDocs.map(renderDocLink)
        ) : (
          <p className="text-sm text-gray-400">Nothing shared with you.</p>
        )}
      </div>
    </div>
  );
}
