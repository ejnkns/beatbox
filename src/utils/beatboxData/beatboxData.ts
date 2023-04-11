type Breath = "in" | "out" | "hold";
type PitchType = "high" | "low" | "mid" | "none" | "multiple";
type Interval = "octave" | "fifth" | "third";
type VowelShape = "a" | "e" | "i" | "o" | "u" | "y" | "w" | "h";
type Duration = "short" | "medium" | "long";

export type Sound = {
  name: string;
  related: string[];
  categories: string[];
  properties: Partial<SoundProperties>;
};
type SoundProperties = {
  breath: Breath;
  vocalised: boolean;
  pitch: {
    type: PitchType;
    pitchCount: number;
    interval: Interval;
  };
  vowelShape: VowelShape;
  lipShape: {
    touching: boolean;
    rounded: boolean;
    protruded: boolean;
    oscillating: boolean;
    tight: boolean;
    loose: boolean;
  };
  percussive: boolean;
  duration: {
    typical: Duration;
    min: Duration;
    max: Duration;
  };
  uvular: boolean;
  glottal: boolean;
  tongue: {
    pitched: boolean;
  };
  fricative: boolean;
};
