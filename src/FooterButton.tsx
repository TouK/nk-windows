import { cx } from "emotion";
import React, { useCallback, useState } from "react";
import { buttonReset } from "./classNames";
import { LaddaButton } from "./LaddaButton";
import { useButtonTheme } from "./themeHooks";

export interface WindowButtonProps {
  title: string;
  action: () => void | Promise<void>;
  disabled?: boolean;
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
    <LaddaButton
      type="button"
      className={cx(buttonReset, buttonTheme)}
      onClick={onClick}
      disabled={isDisabled}
      data-style={"zoom-in"}
      loading={working}
      {...props}
    >
      {props.title}
    </LaddaButton>
  );
}
