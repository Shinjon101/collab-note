"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarDocumentsProps {
  docs: {
    id: number;
    title: string | null;
  }[];
}

export default function SidebarDocuments({ docs }: SidebarDocumentsProps) {
  const pathname = usePathname();

  if (!docs.length)
    return <p className="text-sm text-gray-500">No documents yet.</p>;

  return (
    <div className="mt-2 space-y-2 w-full flex flex-col items-center">
      {docs.map((doc) => {
        const isActive = pathname === `/documents/${doc.id}`;

        return (
          <Link
            key={doc.id}
            href={`/documents/${doc.id}`}
            className={`border py-1 rounded-md text-center px-5 ${
              isActive
                ? "bg-gray-300 font-bold border-black"
                : "border-gray-400"
            }`}
          >
            {doc.title || "Untitled"}
          </Link>
        );
      })}
    </div>
  );
}
