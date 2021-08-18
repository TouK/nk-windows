import { css, cx } from "emotion";
import { useTheme } from "emotion-theming";
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { AppTheme } from "../../../AppTheme";
import { buttonReset } from "../footer/ButtonReset";

export type HeaderButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const useStyles = () => {
  const { colors } = useTheme<AppTheme>();
  return css({
    lineHeight: 0,
    height: "100%",
    svg: {
      height: "100%",
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

export function HeaderButton({ className, ...props }: HeaderButtonProps): JSX.Element {
  const headerButtonTheme = useStyles();
  return <button className={cx(buttonReset, headerButtonTheme, className)} {...props} />;
}
