import { css, cx } from "@emotion/css";
import { useTheme } from "@emotion/react";
import React, { ReactNode, useCallback, useState } from "react";
import { buttonReset } from "./ButtonReset";

export interface FooterButtonProps {
  title: string;
  action: () => void | Promise<void>;
  disabled?: boolean;
  /**
   * @deprecated use className instead
   * */
  classname?: string;
  className?: string;
}

const useButtonTheme = () => {
  const { spacing = {}, colors } = useTheme();
  const { baseUnit = 2 } = spacing;
  return css({
    textTransform: "uppercase",
    paddingTop: baseUnit,
    paddingBottom: baseUnit,
    paddingLeft: baseUnit * 6,
    paddingRight: baseUnit * 6,
    border: "1px solid",
    margin: baseUnit * 2,
    ":not(:first-child)": {
      marginLeft: baseUnit,
    },
    ":not(:last-child)": {
      marginRight: baseUnit,
    },
    ":disabled": {
      opacity: 0.5,
    },
    backgroundColor: colors.primaryBackground,
    ":focus, :not(:disabled):hover": {
      borderColor: colors.focusColor,
      backgroundColor: colors.secondaryBackground,
    },
  });
};

export function FooterButton({ action, disabled, classname, className = classname, ...props }: FooterButtonProps): ReactNode {
  const [working, setWorking] = useState(false);
  const [error, setError] = useState(false);
  const onClick = useCallback(async () => {
    setWorking(true);
    setError(null);
    try {
      await action();
    } catch (e) {
      setError(true);
    }
    setWorking(false);
  }, [action]);
  const isDisabled = disabled || working;
  const buttonTheme = useButtonTheme();
  return (
    <button
      type="button"
      className={cx(buttonReset, buttonTheme, { "action-failed": error }, className)}
      onClick={onClick}
      disabled={isDisabled}
      {...props}
    >
      {props.title}
    </button>
  );
}
