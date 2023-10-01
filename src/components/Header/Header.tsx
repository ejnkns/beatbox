import Link from "next/link";
import { Sticky } from "../Sticky";
import { useSession } from "next-auth/react";
import { LoginButton } from "./LoginButton";

export const Header = () => {
  return (
    <Sticky>
      <header className="flex w-full flex-col items-center text-center">
        <nav className="flex h-10 w-full items-center justify-between bg-indigo-200 bg-opacity-20 px-6 py-2 backdrop-blur-lg backdrop-filter">
          <div className="flex items-center space-x-4">
            <Link href="/" className="absolute text-2xl font-bold">
              Beatbox Sounds
            </Link>
          </div>

          <LoginButton />
        </nav>
      </header>
    </Sticky>
  );
};
