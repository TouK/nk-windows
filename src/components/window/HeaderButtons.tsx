import { css, cx } from "@emotion/css";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";

export function HeaderButtons({ className, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return <div className={cx(css({ display: "block" }), className)} {...props} />;
}
