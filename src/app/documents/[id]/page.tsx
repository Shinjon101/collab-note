import Document from "@/components/Document";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Document id={id} />
    </div>
  );
};

export default page;
