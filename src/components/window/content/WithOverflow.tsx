import { css, cx } from "emotion";
import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { MoveFocusInside } from "react-focus-lock";
import { useSize } from "../../../hooks";

export type WithOverflowProps = PropsWithChildren<{
  className?: string;
}>;

export function WithOverflow(props: WithOverflowProps): JSX.Element {
  const { children, className } = props;
  const { observe: ref, height: availableHeight, entry } = useSize();
  const { observe: childRef, height: contentHeight } = useSize();

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

  const overflowSize = useMemo(() => Math.round(contentHeight - availableHeight), [availableHeight, contentHeight]);
  const [overflows, setOverflows] = useState([0, 0]);
  const updateOverflows = useCallback(() => {
    const scrollTop = entry?.target.scrollTop;
    const topOverflow = Math.min(2, scrollTop / 10);
    const bottomOverflow = Math.min(2, (overflowSize - scrollTop) / 10);
    setOverflows([topOverflow, bottomOverflow]);
  }, [entry, overflowSize]);

  useEffect(() => {
    updateOverflows();
  }, [updateOverflows]);

  const styles = useMemo(
    () =>
      overflows.map((size) => ({
        boxShadow: `0 0 4px ${Math.max(0, size)}px rgba(0,0,0, .5)`,
      })),
    [overflows],
  );

  const [top, bottom] = styles;

  return (
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
  );
}
