"use client";
import {
  RoomProvider as RoomProviderWrapper,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import LoadingSpinner from "./LoadingSpinner";
import LiveCursorProvider from "./LiveCursorProvider";
import DocumentSkeleton from "./DocumentSkelton";

const RoomProvider = ({
  roomID,
  children,
}: {
  roomID: string;
  children: React.ReactNode;
}) => {
  return (
    <RoomProviderWrapper id={roomID} initialPresence={{ cursor: null }}>
      <ClientSideSuspense fallback={<DocumentSkeleton />}>
        <LiveCursorProvider>{children}</LiveCursorProvider>
      </ClientSideSuspense>
    </RoomProviderWrapper>
  );
};

export default RoomProvider;
