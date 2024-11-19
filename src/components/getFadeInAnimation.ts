import { css } from "@emotion/css";

export const getFadeInAnimation = (t = 0.25) => ({
  animationTime: t,
  mounted: css({
    opacity: 0,
    transition: `opacity ${t}s ease-in-out`,
  }),
  entered: css({
    opacity: 1,
  }),
  exited: css({
    opacity: 0,
  }),
});

export type FadeInAnimation = ReturnType<typeof getFadeInAnimation>;
export const defaultFadeAnimation = getFadeInAnimation();
export const fastFadeAnimation = getFadeInAnimation(0.15);
