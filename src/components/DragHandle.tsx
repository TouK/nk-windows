import { css, cx } from "@emotion/css";
import React, { MouseEvent, PropsWithChildren, ReactElement, useCallback } from "react";
import { DRAG_HANDLE_CLASS_NAME } from "../consts";

type DragHandleProps = {
  disabled?: boolean;
  ignoredChildren?: string;
  className?: string;
  el?: ReactElement;
};

export function DragHandle(props: PropsWithChildren<DragHandleProps>): JSX.Element {
  const { children, className, disabled, el = <div />, ignoredChildren = `a, textarea, input, select, button` } = props;
  const onMouseDown = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const targets = e.nativeEvent.composedPath();
      const childTargets = targets.slice(0, targets.indexOf(e.currentTarget));
      if (childTargets.some((el: HTMLElement) => el.matches(ignoredChildren))) {
        e.stopPropagation();
      }
    },
    [ignoredChildren],
  );

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
    onMouseDown,
  });
}
