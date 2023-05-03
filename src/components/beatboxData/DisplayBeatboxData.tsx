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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-xl font-bold">Beatbox Sounds</span>
        {beatboxSounds.map((beatboxSound, i) => (
          <div key={`${beatboxSound.name}-${i}`} className="flex gap-2">
            <Link
              className={`w-full hover:bg-blue-100 ${
                i % 2 === 0 ? "bg-slate-50 text-gray-800" : "text-gray-600"
              }`}
              href={{
                pathname: `/sound/${beatboxSound.name}`,
              }}
            >
              <span className="text-sm">{beatboxSound.name}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
