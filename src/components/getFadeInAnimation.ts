import { css } from "@emotion/css";

export const getFadeInAnimation = (t = 0.25) => ({
  enter: css({
    opacity: 0,
  }),
  enterActive: css({
    opacity: 1,
    transition: `opacity ${t}s ease-in-out`,
    pointerEvents: "none",
  }),
  exit: css({
    opacity: 1,
  }),
  exitActive: css({
    opacity: 0,
    transition: `opacity ${t}s ease-in-out`,
    pointerEvents: "none",
  }),
});

export const defaultFadeAnimation = getFadeInAnimation();
export const fastFadeAnimation = getFadeInAnimation(0.15);
