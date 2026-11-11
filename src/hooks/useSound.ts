import { useState } from "react";

import { areUiSoundsEnabled, playUiSound, setUiSoundsEnabled } from "../utils/uiSounds";

export const useSound = () => {
  const [enabled, setEnabled] = useState(areUiSoundsEnabled);

  const toggleSound = () => {
    const nextEnabled = !enabled;

    if (!nextEnabled) {
      void playUiSound("click");
    }

    setUiSoundsEnabled(nextEnabled);
    setEnabled(nextEnabled);

    if (nextEnabled) {
      void playUiSound("click");
    }
  };

  return {
    soundEnabled: enabled,
    toggleSound,
  };
};
