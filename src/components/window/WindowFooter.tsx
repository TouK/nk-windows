import { css, cx } from "@emotion/css";
import { uniqBy } from "lodash";
import React, { PropsWithChildren, useMemo } from "react";
import { ContentClasses } from "./DefaultContent";
import * as defaultFooterComponents from "./footer";
import { FooterButtonProps } from "./footer";

export type WindowFooterProps = PropsWithChildren<{
  buttons?: FooterButtonProps[];
  disabled?: boolean;
  classnames?: Pick<ContentClasses, "footer" | "footerButton">;
  components?: Partial<typeof defaultFooterComponents>;
  className?: string;
}>;

export function WindowFooter({
  buttons = [],
  disabled: allDisabled,
  children,
  classnames = {},
  components = {},
  className,
}: WindowFooterProps): JSX.Element {
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
    <footer className={cx(flexClass, css({ justifyContent: "center" }), classnames.footer, className)}>
      {children}
      <div>
        {uniqButtons.map(({ disabled, classname, className = classname, title, ...props }) => (
          <Button
            key={title}
            title={title}
            disabled={allDisabled || disabled}
            {...props}
            className={cx(className, classnames.footerButton)}
          />
        ))}
      </div>
    </footer>
  );
}
