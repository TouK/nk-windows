import { css, cx } from "@emotion/css";
import React, { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

export function HeaderButtons({ className, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>): ReactNode {
  return <div className={cx(css({ display: "block" }), className)} {...props} />;
}
