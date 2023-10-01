import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const LoginButton = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex items-center gap-4">
      {sessionData?.user && (
        <Link
          href={{ pathname: `/profile/${sessionData.user.name}` }}
          className="flex items-center border-2 border-black"
        >
          <span className=" font-mono text-sm px-1">{sessionData.user?.name}</span>
        </Link>
      )}
      <button
        type="button"
        className="h-5 w-5 text-sm"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? <LogOut className="h-4 w-4" /> : <LogIn />}
      </button>
    </div>
  );
};
