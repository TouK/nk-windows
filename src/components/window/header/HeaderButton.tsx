import { css, cx } from "@emotion/css";
import { useTheme } from "@emotion/react";
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  KeyboardEvent,
  KeyboardEventHandler,
  PointerEventHandler,
} from "react";
import { buttonReset } from "../footer/ButtonReset";

export type HeaderButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  action?: PointerEventHandler<HTMLButtonElement> & KeyboardEventHandler<HTMLButtonElement>;
};

const useStyles = () => {
  const { colors } = useTheme();
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

function filterByKeys<T = Element>(action: KeyboardEventHandler<T>, keys: KeyboardEvent["key"][]): KeyboardEventHandler<T> {
  return (e: KeyboardEvent<T>) => {
    if (!keys.includes(e.key)) return;
    return action(e);
  };
}

export const HeaderButton = forwardRef<HTMLButtonElement, HeaderButtonProps>(function HeaderButton({ className, action, ...props }, ref) {
  const headerButtonTheme = useStyles();
  return (
    <button
      className={cx(buttonReset, headerButtonTheme, className)}
      onPointerDown={action}
      onKeyDown={filterByKeys(action, ["Enter", " "])}
      {...props}
      ref={ref}
    />
  );
});
