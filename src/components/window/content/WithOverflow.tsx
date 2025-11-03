import { css, cx } from "@emotion/css";
import React, { PropsWithChildren, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MoveFocusInside } from "react-focus-lock";
import { useForkRef } from "rooks";
import { useSize } from "../../../hooks";
import { Ctx, OverflowContext } from "./OverflowContext";

export type WithOverflowProps = PropsWithChildren<{
  className?: string;
}>;

export function WithOverflow(props: WithOverflowProps): ReactNode {
  const { children, className } = props;
  const { observe: parentRef, height: availableHeight, entry } = useSize();
  const { observe: childRef, height: contentHeight } = useSize();
  const contentHeightRef = useRef(contentHeight);
  contentHeightRef.current = contentHeight;

  const innerShadow = useMemo(
    () =>
      css({
        position: "sticky",
        left: 0,
        zIndex: 1,
        "&>div": {
          content: "''",
          position: "absolute",
          width: "100%",
        },
      }),
    [],
  );

  const overflowSize = useMemo(() => Math.max(0, Math.round(contentHeight - availableHeight)), [availableHeight, contentHeight]);
  const [overflowTop, setOverflowTop] = useState(0);
  const [overflowBottom, setOverflowBottom] = useState(0);
  const updateOverflows = useCallback(() => {
    const scrollTop = entry?.target.scrollTop || 0;
    const topOverflow = Math.max(0, Math.min(2, scrollTop / 10));
    const bottomOverflow = Math.max(0, Math.min(2, (overflowSize - scrollTop) / 10));
    setOverflowTop(topOverflow);
    setOverflowBottom(bottomOverflow);
  }, [entry, overflowSize]);

  useEffect(() => {
    updateOverflows();
  }, [updateOverflows]);

  const [top, bottom] = useMemo(
    () =>
      [overflowTop, overflowBottom].map((size) => ({
        boxShadow: `0 0 4px ${Math.max(0, size)}px rgba(0,0,0, .5)`,
      })),
    [overflowBottom, overflowTop],
  );
  const scrollRef = useRef<HTMLDivElement>();
  const ref = useForkRef(parentRef, scrollRef);

  const scrollTo = useCallback((top: number) => scrollRef.current.scrollTo({ top, behavior: "smooth" }), []);

  const hasBottomOverflow = Boolean(overflowBottom);
  const hasTopOverflow = Boolean(overflowTop);

  const ctx = useMemo<Ctx>(
    () => ({
      scrollTo: hasTopOverflow || hasBottomOverflow ? scrollTo : null,
      scrollToTop: hasTopOverflow ? () => scrollTo(0) : null,
      scrollToBottom: hasBottomOverflow ? () => scrollTo(contentHeightRef.current) : null,
    }),
    [hasBottomOverflow, hasTopOverflow, scrollTo],
  );

  return (
    <OverflowContext.Provider value={ctx}>
      <section ref={ref} onScroll={updateOverflows} className={css({ overflow: "auto" })}>
        {overflowSize >= 0 && (
          <div className={cx(innerShadow, css({ top: 0 }))}>
            <div style={top} />
          </div>
        )}

        <div ref={childRef} className={cx(className)}>
          <MoveFocusInside>{children}</MoveFocusInside>
        </div>

        {overflowSize >= 0 && (
          <div className={cx(innerShadow, css({ bottom: 0 }))}>
            <div style={bottom} />
          </div>
        )}
      </section>
    </OverflowContext.Provider>
  );
}
