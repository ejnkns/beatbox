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
              href={{
                pathname: `/sound/${beatboxSound.name}`,
                query: { id: beatboxSound.id },
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