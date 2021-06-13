import { ThemeProvider } from "emotion-theming";
import { defaultsDeep } from "lodash";
import React, { PropsWithChildren } from "react";
import { WindowManagerContextProvider } from "./context";
import { ContentGetter } from "./WindowContent";
import { WindowsContainer } from "./WindowsContainer";

type AppTheme = {
  themeClass?: string;
  borderRadius?: number;
  colors?: {
    danger?: string;
    dangerLight?: string;
    neutral0?: string;
    neutral5?: string;
    neutral10?: string;
    neutral20?: string;
    neutral30?: string;
    neutral40?: string;
    neutral50?: string;
    neutral60?: string;
    neutral70?: string;
    neutral80?: string;
    neutral90?: string;
    borderColor?: string;
    canvasBackground?: string;
    primaryBackground?: string;
    secondaryBackground?: string;
    primaryColor?: string;
    secondaryColor?: string;
    mutedColor?: string;
    focusColor?: string;
    evenBackground?: string;
    selectedValue?: any;
    accent?: any;
    warning?: any;
    error?: any;
    ok?: any;
    sucess?: any;
    primary?: string;
    primary75?: string;
    primary50?: string;
    primary25?: string;
  };
  spacing?: {
    controlHeight?: number;
    baseUnit?: number;
  };
  fontSize?: number;
};

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
        <ThemeProvider theme={(outerTheme = {}) => defaultsDeep(theme, outerTheme)}>
          <WindowsContainer contentGetter={contentGetter} />
        </ThemeProvider>
      </div>
    </WindowManagerContextProvider>
  );
}
