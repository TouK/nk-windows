import { ThemeProvider } from "@emotion/react";
import { defaultsDeep } from "lodash";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";
import { AppTheme } from "../AppTheme";
import { WindowManagerContextProvider } from "../context";
import { ContentGetter } from "./window/WindowContent";
import { WindowsContainer } from "./WindowsContainer";
import { TransitionProvider } from "./TransitionProvider";

const defaultTheme = {
  backgroundOpacity: 0.9,
  backdropFilter: "blur(16px)",
  colors: {
    focusColor: "#0082c2",
    primaryBackground: "#FFFFFF",
    secondaryBackground: "#CCCCCC",
    borderColor: "#000000",
    mutedColor: "#999999",
  },
  spacing: {
    baseUnit: 5,
  },
  zIndex: 1500,
};

interface WindowManagerProps<K extends number | string = any> extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  theme?: AppTheme;
  contentGetter: ContentGetter<K>;
}

export function WindowManager<K extends number | string = any>({
  theme = {},
  contentGetter,
  children,
  ...props
}: WindowManagerProps<K>): JSX.Element {
  return (
    <TransitionProvider>
      <WindowManagerContextProvider>
        <div {...props}>
          {children}
          <ThemeProvider theme={(outerTheme = {}) => defaultsDeep(theme, outerTheme, defaultTheme)}>
            <WindowsContainer contentGetter={contentGetter} />
          </ThemeProvider>
        </div>
      </WindowManagerContextProvider>
    </TransitionProvider>
  );
}
