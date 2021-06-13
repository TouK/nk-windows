import { css, cx } from "emotion";
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export type HeaderButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const getStyles = (color: string, focusColor: string) =>
  css({
    padding: 2,
    margin: 0,
    lineHeight: 0,
    border: 0,
    background: "transparent",
    appearance: "none",
    height: "100%",
    svg: {
      height: "100%",
      path: { fill: color },
    },
    ":focus, :hover": {
      outline: "none",
      backgroundColor: focusColor,
    },
  });

export function HeaderButton({ className, ...props }: HeaderButtonProps): JSX.Element {
  const headerButtonTheme = getStyles("#000000", "#FF0000");
  return <button className={cx(headerButtonTheme, className)} {...props} />;
}
