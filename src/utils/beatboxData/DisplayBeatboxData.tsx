import { Sound } from "./beatboxData";

export const VibrationBass: Sound = {
  name: "Vibration Bass",
  related: ["Throat Bass", "Strained Voice"],
  categories: ["bass", "subharmonic", "vocal"],
  properties: {
    breath: "out",
    vocalised: true,
    pitch: {
      type: "low",
      pitchCount: 2,
      interval: "fifth",
    },
  },
};

export const DisplayBeatboxData = () => {
  const { name, related, categories, properties } = VibrationBass;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-xl font-bold">Name:</span>
        <span className="text-xl">{name}</span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xl font-bold">Related:</span>
        <span className="text-xl">{related.join(", ")}</span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xl font-bold">Categories:</span>
        <span className="text-xl">{categories?.join(", ")}</span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xl font-bold">Properties:</span>
        {Object.entries(properties).map(([key, value]) => (
          <div key={key} className="flex gap-2">
            <span className="text-sm font-bold">{key}:</span>
            <span className="text-sm">{`${value}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
