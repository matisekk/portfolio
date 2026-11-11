import { useEffect } from "react";

import { themes } from "../constants/themes";

export const usePreloadThemeImages = () => {
  useEffect(() => {
    Object.values(themes).forEach((theme) => {
      const image = new Image();

      image.decoding = "async";
      image.src = theme.image;
    });
  }, []);
};
