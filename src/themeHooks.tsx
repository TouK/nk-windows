import { css } from "emotion";
import { useTheme } from "emotion-theming";
import React from "react";
import { rgba } from "./rgba";

export function useFrameTheme() {
  const theme = useTheme<any>();
  const focusWrapperTheme = css({
    border: `${theme.spacing?.baseUnit / 2}px solid ${theme.colors?.borderColor}`,
  });
  const windowTheme = css({
    background: rgba(theme.colors.primaryBackground, 0.9),
    boxShadow: `0 4px 16px 0 ${rgba(theme.colors.borderColor, 0.5)}`,
  });
  return { focusWrapperTheme, windowTheme };
}

export function useModalMaskTheme() {
  const theme = useTheme<any>();
  const modalMaskTheme = css({
    background: rgba(theme.colors.borderColor, 0.6),
  });
  return modalMaskTheme;
}
