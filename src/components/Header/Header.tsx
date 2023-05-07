import Link from "next/link";
import { Sticky } from "../Sticky";

export const Header = () => {
  return (
    <header className="mt-12 flex flex-col items-center text-center text-6xl">
      <Sticky fixed>
        <nav className="flex w-full items-center justify-between bg-gray-100 bg-opacity-10 px-6 py-2">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold">
              Beatbox Sounds
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href={{ pathname: "/login" }} className="text-xl">
              Login
            </Link>
          </div>
        </nav>
      </Sticky>
    </header>
  );
};
