import { ThemeProvider } from "emotion-theming";
import { defaultsDeep } from "lodash";
import React, { PropsWithChildren } from "react";
import { AppTheme } from "../AppTheme";
import { WindowManagerContextProvider } from "../context";
import { ContentGetter } from "./window/WindowContent";
import { WindowsContainer } from "./WindowsContainer";

const defaultTheme = { backgroundOpacity: 0.9, backdropFilter: "blur(16px)" };

export function WindowManager({
  children,
  theme,
  contentGetter,
}: PropsWithChildren<{
  theme: AppTheme;
  contentGetter: ContentGetter;
}>): JSX.Element {
  return (
    <WindowManagerContextProvider>
      <div>
        {children}
        <ThemeProvider<AppTheme> theme={(outerTheme = {}) => defaultsDeep(theme, outerTheme, defaultTheme)}>
          <WindowsContainer contentGetter={contentGetter} />
        </ThemeProvider>
      </div>
    </WindowManagerContextProvider>
  );
}
