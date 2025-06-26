"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

const Header = () => {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const darkMode = theme === "dark";

  return (
    <div className="flex items-center justify-between p-5">
      {user && (
        <h1 className="tex-2xl font-bold">
          {user?.firstName}
          {`'s`} Notes
        </h1>
      )}

      <div className="flex items-center gap-5">
        <Button onClick={() => setTheme(darkMode ? "light" : "dark")}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>

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
