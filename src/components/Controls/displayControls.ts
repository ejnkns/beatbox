import { SelectOptions } from "./Select";

export const displayOscillators = [
  {
    id: 1,
    name: "sine",
    icon: "https://g.js.org/img/functions/sineWave.svg",
  },
  {
    id: 2,
    name: "triangle",
    icon: "https://g.js.org/img/functions/triangleWave.svg",
  },
  {
    id: 3,
    name: "sawtooth",
    icon: "https://g.js.org/img/functions/sawtoothWave.svg",
  },
  {
    id: 4,
    name: "square",
    icon: "https://g.js.org/img/functions/squareWave.svg",
  },
] satisfies [SelectOptions<OscillatorType>, ...SelectOptions<OscillatorType>[]];
