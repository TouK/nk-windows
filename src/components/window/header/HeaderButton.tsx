import { css, cx } from "@emotion/css";
import { useTheme } from "emotion-theming";
import React, { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from "react";
import { AppTheme } from "../../../AppTheme";
import { buttonReset } from "../footer/ButtonReset";

export type HeaderButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const useStyles = () => {
  const { colors } = useTheme<AppTheme>();
  return css({
    lineHeight: 0,
    svg: {
      height: "2em",
      path: {
        fill: colors.mutedColor,
      },
    },
    ":focus, :hover": {
      svg: {
        path: {
          fill: colors.focusColor,
        },
      },
    },
  });
};

export const HeaderButton = forwardRef(function HeaderButton(
  { className, ...props }: HeaderButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
): JSX.Element {
  const headerButtonTheme = useStyles();
  return <button className={cx(buttonReset, headerButtonTheme, className)} {...props} ref={ref} />;
});
