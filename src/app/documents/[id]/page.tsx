// src/app/documents/[id]/page.tsx
import Document from "@/components/Document";
import { isOwner } from "../../../../actions/isOwner";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params; // Await params since it's now a Promise
  const owner = await isOwner(id);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Document id={id} isOwner={owner} />
    </div>
  );
};

export default page;
