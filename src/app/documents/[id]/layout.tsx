// src/app/documents/[id]/layout.tsx
import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";

interface DocLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
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
