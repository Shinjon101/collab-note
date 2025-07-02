import RoomProvider from "@/components/providers/RoomProvider";
import { auth } from "@clerk/nextjs/server";

interface DocLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>; // params is a Promise in Next.js 15+
}

export default async function DocLayout({ children, params }: DocLayoutProps) {
  await auth(); // Await the auth function

  // Await the params before using them
  const { id } = await params;

  return (
    <RoomProvider roomID={id}>
      <div>{children}</div>
    </RoomProvider>
  );
}
