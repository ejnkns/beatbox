import { useEffect, useState } from "react";

export const useAudioContext = () => {
  const [audioContext, setAudioContext] = useState<AudioContext>();

  useEffect(() => {
    if (!audioContext) {
      const DefinedAudioContext =
        window.AudioContext ||
        ("webkitAudioContext" in window && window.webkitAudioContext);
      setAudioContext(new DefinedAudioContext());
    }

    return () => {
      audioContext?.close();
    };
  }, [audioContext]);

  return audioContext;
};
