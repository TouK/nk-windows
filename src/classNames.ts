import { css } from "emotion";

export const ignorePointerEvents = css({
  pointerEvents: "none",
  "& > *": {
    pointerEvents: "auto",
  },
});

export const buttonReset = css({
  padding: 0,
  margin: 0,
  border: "2px solid transparent",
  background: "transparent",
  appearance: "none",
});
