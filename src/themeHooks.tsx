import { css } from "emotion";
import { useTheme } from "emotion-theming";
import React from "react";
import { rgba } from "./rgba";

export function useButtonTheme(isDisabled: boolean) {
  const theme = useTheme<any>();
  const buttonTheme = css({
    textTransform: "uppercase",
    fontSize: "1.5em",
    padding: theme.spacing.baseUnit * 6,
    paddingTop: theme.spacing.baseUnit,
    paddingBottom: theme.spacing.baseUnit,
    opacity: isDisabled ? 0.5 : 1,
    borderWidth: theme.spacing.baseUnit / 3,
    borderStyle: "solid",
    borderColor: theme.colors.mutedColor,
    backgroundColor: theme.colors.primaryBackground,
    margin: theme.spacing.baseUnit * 2,
    "&:not(:first-child)": {
      marginLeft: theme.spacing.baseUnit,
    },
    "&:not(:last-child)": {
      marginRight: theme.spacing.baseUnit,
    },
    "&:disabled, &:disabled:hover": {
      backgroundColor: theme.colors.secondaryBackground,
    },
    "&:hover": {
      backgroundColor: theme.colors.secondaryBackground,
    },
  });
  return buttonTheme;
}

export function useFrameTheme() {
  const theme = useTheme<any>();
  const focusWrapperTheme = css({
    border: `${theme.spacing.baseUnit / 2}px solid ${theme.colors.borderColor}`,
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

export function useLaddaButtonTheme() {
  const theme = useTheme<any>();
  return css({
    padding: 0,
    outline: "none",
    ":focus, :active:focus": {
      outline: "none",
      borderColor: theme.colors?.focusColor,
      boxShadow: `0 0 0 1px ${theme.colors?.focusColor}`,
    },
  });
}
