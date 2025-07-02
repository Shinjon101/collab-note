// src/app/documents/[id]/layout.tsx
import RoomProvider from "@/components/providers/RoomProvider";
import { auth } from "@clerk/nextjs/server";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>; // Changed: params is now a Promise
}

export default async function DocLayout({ children, params }: LayoutProps) {
  await auth(); // Await the auth function
  const { id } = await params; // Await params since it's now a Promise

  return (
    <RoomProvider roomID={id}>
      <div>{children}</div>
    </RoomProvider>
  );
}
