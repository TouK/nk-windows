import { css, cx } from "emotion";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const titleClassName = css({
  fontSize: 14,
  fontWeight: 600,
  textTransform: "lowercase",
  padding: ".25em .5em",
});

export function HeaderTitle({ children, className }: Props): JSX.Element {
  return (
    <div className={cx(titleClassName, className)}>
      <span>{children}</span>
    </div>
  );
}
