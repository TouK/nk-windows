import { css, cx } from "emotion";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";

export function HeaderButtons({ className, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element {
  return <div className={cx(css({ display: "block" }), className)} {...props} />;
}
