import { Tutorial as TutorialType } from "@prisma/client";
import { youTubeGetID } from "~/utils/helpers";

export const Tutorial = ({ tutorial }: { tutorial: TutorialType }) => (
  <div className="flex gap-2">
    {tutorial.url && (
      <iframe
        src={"https://www.youtube.com/embed/" + youTubeGetID(tutorial.url)}
        title={tutorial.name}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    )}
  </div>
);
