import { css, cx } from "emotion";
import { uniqBy } from "lodash";
import React, { PropsWithChildren } from "react";
import { WindowButtonProps, WindowFooterButton } from "./FooterButton";

interface WindowFooterProps {
  buttons?: WindowButtonProps[];
  disabled?: boolean;
  className?: string;
}

export function WindowFooter({
  buttons = [],
  disabled: allDisabled,
  children,
  className,
}: PropsWithChildren<WindowFooterProps>): JSX.Element {
  const uniqButtons = uniqBy(buttons, (b) => b.title);
  const flexClass = css({
    display: "flex",
    alignContent: "stretch",
    alignItems: "stretch",
    flexDirection: "row",
  });

  return (
    <footer className={cx(flexClass, css({ justifyContent: "center" }), className)}>
      {children}
      <div>
        {uniqButtons.map(({ disabled, ...props }) => (
          <WindowFooterButton key={props.title} disabled={allDisabled || disabled} {...props} />
        ))}
      </div>
    </footer>
  );
}
