import Document from "@/components/Document";
import { isOwner } from "../../../../actions/isOwner";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const owner = await isOwner(id);
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Document id={id} isOwner={owner} />
    </div>
  );
};

export default page;
