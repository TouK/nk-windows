import { css, cx } from "emotion";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";

export function WindowContentGrid({ className, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element {
  const contentClass = css({
    width: "100%",
    height: "100%",
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
  });
  return <div className={cx(contentClass, className)} {...props} />;
}
