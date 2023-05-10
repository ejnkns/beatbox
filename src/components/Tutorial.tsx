import { Tutorial as TutorialType } from "@prisma/client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

export const Tutorial = ({ tutorial }: { tutorial: TutorialType }) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch(`https://noembed.com/embed?dataType=json&url=${tutorial.url}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
      });
  });

  return (
    <div className="flex flex-col gap-2 border-2 border-black bg-indigo-200 bg-opacity-50 backdrop-blur-lg">
      <h3 className="mt-2 p-2 text-xl font-bold">{title}</h3>
      {tutorial.url && (
        <div className="flex">
          <ReactPlayer
            url={tutorial.url}
            title={tutorial.name}
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">Loading...</div>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};
