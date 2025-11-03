import { css, cx } from "@emotion/css";
import React, { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

export type HeaderTitleProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const titleClassName = css({
  fontWeight: 600,
  textTransform: "lowercase",
  padding: ".25em .5em",
});

export function HeaderTitle({ children, className }: HeaderTitleProps): ReactNode {
  return (
    <div className={cx(titleClassName, className)}>
      <span>{children}</span>
    </div>
  );
}
