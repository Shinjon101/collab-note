import Link from "next/link";
import { getUserDocs } from "../../actions/getUserDocuments";

export default async function SidebarDocuments() {
  const docs = await getUserDocs();

  if (!docs.length)
    return <p className="text-sm text-gray-500">No documents yet.</p>;

  return (
    <div className="mt-4 space-y-2 w-full">
      {docs.map((doc) => (
        <Link
          key={doc.id}
          href={`/documents/${doc.id}`}
          className="block px-3 py-2 rounded hover:bg-gray-300 text-sm font-medium text-gray-800"
        >
          {doc.title || "Untitled"}
        </Link>
      ))}
    </div>
  );
}
