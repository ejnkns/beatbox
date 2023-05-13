import Link from "next/link";
import { Sticky } from "../Sticky";
import { LoginButton } from "./LoginButton";

export const Header = () => {
  return (
    <header className="flex w-full flex-col items-center text-center">
      <Sticky fixed>
        <nav className="flex w-full items-center justify-between bg-indigo-200 bg-opacity-20 px-6 py-2 backdrop-blur-sm backdrop-filter">
          <div className="flex items-center space-x-4">
            <Link href="/" className="absolute text-2xl font-bold">
              Beatbox Sounds
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <LoginButton />
          </div>
        </nav>
      </Sticky>
    </header>
  );
};
