import { css, cx } from "emotion";
import React, { PropsWithChildren, useMemo } from "react";
import { ignorePointerEvents } from "./classNames";
import { useSize } from "./hooks";
import { ViewportContext } from "./ViewportContext";

const fullscreenFixed = css({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  position: "fixed",
  zIndex: 1000,
});

export function WindowsViewport({ children }: PropsWithChildren<unknown>): JSX.Element {
  const { observe, height, width } = useSize();
  const value = useMemo(() => ({ width, height }), [height, width]);
  return (
    <div className={cx(fullscreenFixed, ignorePointerEvents)} ref={observe}>
      <ViewportContext.Provider value={value}>{children}</ViewportContext.Provider>
    </div>
  );
}
