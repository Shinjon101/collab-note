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
import HeaderSkeleton from "./HeaderSkeleton";

const Header = () => {
  const { user, isLoaded } = useUser();
  const { theme, setTheme } = useTheme();
  const darkMode = theme === "dark";

  if (!isLoaded) {
    return <HeaderSkeleton />;
  }

  return (
    <header className="flex items-center justify-between p-5 bg-secondary">
      {user && (
        <h1 className="tex-2xl font-bold">
          {user?.firstName}
          {`'s`} Notes
        </h1>
      )}

      <section className="flex items-center gap-5">
        <Button
          variant="outline"
          onClick={() => setTheme(darkMode ? "light" : "dark")}
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>

        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="default">Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </section>
    </header>
  );
};

export default Header;
