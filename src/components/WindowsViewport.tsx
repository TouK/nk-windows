import { css, cx } from "@emotion/css";
import { useTheme } from "@emotion/react";
import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
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

  const [visualHeight, setVisualHeight] = useState(visualViewport?.height || window.innerHeight);

  useEffect(() => {
    const listener = () => setVisualHeight(visualViewport?.height);
    visualViewport?.addEventListener("resize", listener);
    return () => {
      visualViewport?.removeEventListener("resize", listener);
    };
  }, []);

  const value = useMemo(() => ({ width, height: Math.min(height, visualHeight) }), [height, width, visualHeight]);

  const { zIndex } = useTheme();
  return (
    <div className={cx(fullscreenFixed, ignorePointerEvents, css({ zIndex }))} ref={observe}>
      <ViewportContext.Provider value={value}>{children}</ViewportContext.Provider>
    </div>
  );
}
