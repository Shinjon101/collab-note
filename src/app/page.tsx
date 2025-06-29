"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useAuth();
  return (
    <main className="">
      <div className="flex mt-2  animate-pulse">
        <ArrowLeftIcon className="mr-1" />
        <h1 className="font-bold">
          {isSignedIn
            ? "Click here to make a new note"
            : "Sign up to make a new note"}
        </h1>
      </div>
    </main>
  );
}
