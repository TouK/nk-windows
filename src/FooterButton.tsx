import { css, cx } from "emotion";
import { useTheme } from "emotion-theming";
import React, { useCallback, useState } from "react";
import { buttonReset } from "./classNames";

export interface WindowButtonProps {
  title: string;
  action: () => void | Promise<void>;
  disabled?: boolean;
}

export function useButtonTheme(isDisabled: boolean) {
  const theme = useTheme<any>();
  const { spacing = {}, colors } = theme;
  const { baseUnit = 4 } = spacing;
  const buttonTheme = css({
    textTransform: "uppercase",
    padding: baseUnit * 6,
    paddingTop: baseUnit,
    paddingBottom: baseUnit,
    opacity: isDisabled ? 0.5 : 1,
    borderWidth: baseUnit / 3,
    borderStyle: "solid",
    borderColor: colors.mutedColor,
    backgroundColor: colors.primaryBackground,
    margin: baseUnit * 2,
    "&:not(:first-child)": {
      marginLeft: baseUnit,
    },
    "&:not(:last-child)": {
      marginRight: baseUnit,
    },
    "&:disabled, &:disabled:hover": {
      backgroundColor: colors.secondaryBackground,
    },
    "&:hover": {
      backgroundColor: colors.secondaryBackground,
    },
  });
  return buttonTheme;
}

export function WindowFooterButton({ action, disabled, ...props }: WindowButtonProps): JSX.Element {
  const [working, setWorking] = useState(false);
  const onClick = useCallback(async () => {
    setWorking(true);
    await action();
    setWorking(false);
  }, [action]);
  const isDisabled = disabled || working;
  const buttonTheme = useButtonTheme(isDisabled);
  return (
    <button type="button" className={cx(buttonReset, buttonTheme)} onClick={onClick} disabled={isDisabled} {...props}>
      {props.title}
    </button>
  );
}
