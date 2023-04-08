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

    if (audioContext?.state === "running") {
      audioContext.suspend();
    }

    return () => {
      audioContext?.close();
    };
  }, [audioContext]);

  return audioContext;
};
