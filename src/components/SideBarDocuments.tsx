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
    <div className="mt-5 space-y-2 w-full ">
      {docs.map((doc) => {
        const isActive = pathname === `/documents/${doc.id}`;

        return (
          <div
            className={`relative border p-2 rounded-md ${
              isActive
                ? "bg-gray-300 font-bold border-black"
                : "border-gray-400"
            }`}
          >
            <Link key={doc.id} href={`/documents/${doc.id}`}>
              {doc.title || "Untitled"}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
