import { css, cx } from "@emotion/css";
import React, { PropsWithChildren, ReactElement, ReactNode } from "react";
import { DRAG_HANDLE_CLASS_NAME } from "../consts";

type DragHandleProps = {
  disabled?: boolean;
  /**
   * @deprecated this is ignored now - use DRAG_PREVENT_CLASS_NAME ("no-drag")
   */
  ignoredChildren?: string;
  className?: string;
  el?: ReactElement;
};

export function DragHandle(props: PropsWithChildren<DragHandleProps>): ReactNode {
  const { children, className, disabled, el = <div /> } = props;

  const element = React.Children.only(el);
  return React.cloneElement(element, {
    ...element.props,
    className: cx([
      css({ cursor: disabled ? "inherit" : "move" }),
      !disabled && DRAG_HANDLE_CLASS_NAME,
      element.props.className,
      className,
    ]),
    children: children || element.props.children,
  });
}
