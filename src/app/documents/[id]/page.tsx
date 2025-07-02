// src/app/documents/[id]/page.tsx
import Document from "@/components/document/Document";
import { isOwner } from "../../../../actions/isOwner";
import { auth } from "@clerk/nextjs/server";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { userId } = await auth();
  const { owns } = await isOwner(id);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Document id={id} isOwner={owns} userId={userId!} />
    </div>
  );
};

export default page;
