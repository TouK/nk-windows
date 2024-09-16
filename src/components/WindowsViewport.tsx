import { css, cx } from "@emotion/css";
import { useTheme } from "@emotion/react";
import React, { PropsWithChildren, useMemo } from "react";
import { useSize } from "../hooks";
import { ViewportContext } from "../ViewportContext";

const ignorePointerEvents = css({
  pointerEvents: "none",
  "& > *": {
    pointerEvents: "auto",
  },
});

const fullscreenFixed = css({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  position: "fixed",
});

export function WindowsViewport({ children }: PropsWithChildren<unknown>): JSX.Element {
  const { observe, height, width } = useSize();
  const value = useMemo(() => ({ width, height }), [height, width]);

  const { zIndex } = useTheme();
  return (
    <div id={"windowsViewport"} className={cx(fullscreenFixed, ignorePointerEvents, css({ zIndex }))} ref={observe}>
      <ViewportContext.Provider value={value}>{children}</ViewportContext.Provider>
    </div>
  );
}
