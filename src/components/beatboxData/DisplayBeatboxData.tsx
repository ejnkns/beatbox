import { BeatboxSound } from "@prisma/client";
import Link from "next/link";

export const DisplayBeatboxData = ({
  beatboxSounds,
}: {
  beatboxSounds: BeatboxSound[];
}) => {
  //ssl.gstatic.com/docs/doclist/images/empty_state_details.png
  // https: //ssl.gstatic.com/docs/doclist/images/empty_state_details.png
  // https: //ssl.gstatic.com/docs/doclist/images/empty_state_details.png
  // https: //ssl.gstatic.com/docs/doclist/images/empty_state_details.png
  // https: //ssl.gstatic.com/docs/doclist/images/empty_state_details.png
  return (
    <div className="flex flex-col overflow-x-hidden">
      {beatboxSounds.map((beatboxSound, i) => (
        <Link
          key={`${beatboxSound.name}-${i}`}
          className={`${i % 2 === 0 ? "text-white" : "bg-slate-300 text-white"}
          flex w-full origin-left transform items-center justify-between border-b border-black bg-opacity-10 p-2 bg-blend-saturation transition-all duration-300 ease-in-out hover:scale-110 hover:bg-opacity-20 hover:text-blue-200
          `}
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
