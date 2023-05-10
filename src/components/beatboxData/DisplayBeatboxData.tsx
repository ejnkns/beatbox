import { BeatboxSound } from "@prisma/client";
import Link from "next/link";

export const DisplayBeatboxData = ({
  beatboxSounds,
}: {
  beatboxSounds: BeatboxSound[];
}) => {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {beatboxSounds.map((beatboxSound, i) => (
        <Link
          key={`${beatboxSound.name}-${i}`}
          className={`flex w-full origin-left transform items-center justify-between border-b border-black bg-opacity-10 p-2 bg-blend-saturation transition-all duration-300 ease-in-out hover:scale-110

          ${i % 2 === 0 ? "text-gray-300" : "bg-slate-300 text-gray-300"}`}
          href={{
            pathname: `/sound/${beatboxSound.name}`,
          }}
        >
          <div className="flex w-full justify-between">
            <div className="ml-1 text-sm">{beatboxSound.name}</div>
            {/* <div className="mr-1 text-xs text-indigo-200">
              {beatboxSound.category}
            </div> */}
          </div>
        </Link>
      ))}
    </div>
  );
};
