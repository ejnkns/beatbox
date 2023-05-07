import { BeatboxSound } from "@prisma/client";
import { api } from "../../utils/api";
import Link from "next/link";
import { useEffect, useState } from "react";

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
          className={`w-full origin-left bg-opacity-10 bg-blend-saturation transition-all hover:scale-110 ${
            i % 2 === 0 ? "text-gray-800" : "bg-slate-300 text-gray-900"
          }`}
          href={{
            pathname: `/sound/${beatboxSound.name}`,
          }}
        >
          <span className="ml-1 text-sm">{beatboxSound.name}</span>
        </Link>
      ))}
    </div>
  );
};
