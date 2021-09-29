import { css, cx } from "@emotion/css";
import { useTheme } from "emotion-theming";
import React, { useMemo } from "react";
import { AppTheme } from "./AppTheme";
import { rgba } from "./rgba";

export function useFrameTheme() {
  const { colors, spacing = {}, backgroundOpacity, backdropFilter } = useTheme<AppTheme>();
  const { baseUnit = 0 } = spacing;
  const focusWrapperTheme = css({
    border: `${Math.round(baseUnit / 2)}px solid ${colors?.borderColor}`,
  });
  const windowMargin = useMemo(() => Math.max(8, baseUnit * 2), [baseUnit]);
  const windowTheme = useMemo(
    () =>
      cx(
        css({
          backdropFilter: backdropFilter,
          background: rgba(colors.primaryBackground, backgroundOpacity),
          boxShadow: `0 4px 16px 0 ${rgba(colors.borderColor, 0.5)}`,
          margin: windowMargin, // just to show in devtools
        }),
      ),
    [backdropFilter, backgroundOpacity, colors.borderColor, colors.primaryBackground, windowMargin],
  );

  return { focusWrapperTheme, windowTheme, windowMargin };
}

export function useModalMaskTheme() {
  const theme = useTheme<any>();
  const modalMaskTheme = css({
    background: rgba(theme.colors.borderColor, 0.6),
  });
  return modalMaskTheme;
}
