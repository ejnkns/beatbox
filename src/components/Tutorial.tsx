import { Tutorial as TutorialType } from "@prisma/client";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

export const Tutorial = ({ tutorial }: { tutorial: TutorialType }) => {
  return (
    <div className="flex gap-2">
      {tutorial.url && (
        <>
          <ReactPlayer
            url={tutorial.url}
            title={tutorial.name}
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">Loading...</div>
              </div>
            }
          />
        </>
      )}
    </div>
  );
};
