"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";

const Header = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between p-5 bg-white">
      {user && (
        <h1 className="tex-2xl font-bold">
          {user?.firstName}
          {`'s`} Notes
        </h1>
      )}

      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Header;
