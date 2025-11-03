import React, { createContext, memo, useContext } from "react";
import { WindowContentProps } from "./WindowContentProps";

export type ContentGetter<K extends number | string = any> = React.FC<WindowContentProps<K, unknown>>;

const WindowContentCtx = createContext<WindowContentProps>(null);

export function useWindowContext<K extends number | string = any, M = unknown>(): WindowContentProps<K, M> {
  const context = useContext(WindowContentCtx);

  if (!context) {
    throw new Error("used outside WindowContent");
  }

  return context;
}

export const WindowContent = memo(function WindowContent<K extends number | string = any>({
  contentGetter,
  ...props
}: WindowContentProps<K, unknown> & { contentGetter: ContentGetter }) {
  const Component = contentGetter;
  return (
    <WindowContentCtx.Provider value={props}>
      <Component {...props} />
    </WindowContentCtx.Provider>
  );
});
