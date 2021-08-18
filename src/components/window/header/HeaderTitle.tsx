import { css, cx } from "emotion";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";

export type HeaderTitleProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const titleClassName = css({
  fontSize: 14,
  fontWeight: 600,
  textTransform: "lowercase",
  padding: ".25em .5em",
});

export function HeaderTitle({ children, className }: HeaderTitleProps): JSX.Element {
  return (
    <div className={cx(titleClassName, className)}>
      <span>{children}</span>
    </div>
  );
}
