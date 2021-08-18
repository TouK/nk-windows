import { css, cx } from "emotion";
import { uniqBy } from "lodash";
import React, { PropsWithChildren, useMemo } from "react";
import { defaultFooterComponents } from "./DefaultFooterComponents";
import { WindowButtonProps } from "./FooterButton";

interface WindowFooterProps {
  buttons?: WindowButtonProps[];
  disabled?: boolean;
  className?: string;
  components?: Partial<typeof defaultFooterComponents>;
}

export function WindowFooter({
  buttons = [],
  disabled: allDisabled,
  children,
  className,
  components = {},
}: PropsWithChildren<WindowFooterProps>): JSX.Element {
  const uniqButtons = uniqBy(buttons, (b) => b.title);
  const flexClass = css({
    display: "flex",
    alignContent: "stretch",
    alignItems: "stretch",
    flexDirection: "row",
  });

  const { FooterButton: Button } = useMemo(
    () => ({
      ...defaultFooterComponents,
      ...components,
    }),
    [components],
  );

  return (
    <footer className={cx(flexClass, css({ justifyContent: "center" }), className)}>
      {children}
      <div>
        {uniqButtons.map(({ disabled, ...props }) => (
          <Button key={props.title} disabled={allDisabled || disabled} {...props} />
        ))}
      </div>
    </footer>
  );
}
