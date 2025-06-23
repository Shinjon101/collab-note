import { Room } from "@/app/Room";
import Document from "@/components/Document";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Room>
        <Document id={id} />
      </Room>
    </div>
  );
};

export default page;
