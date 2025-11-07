import { css, cx } from "@emotion/css";
import React, { useMemo } from "react";
import { DragHandle } from "../DragHandle";
import { ContentClasses } from "./DefaultContent";
import * as defaultHeaderComponents from "./header";
import { HeaderButtons } from "./HeaderButtons";
import { Components } from "./typeHelpers";

export interface WindowHeaderProps {
  title?: string;
  closeDialog?: () => void;
  zoomDialog?: (value?: boolean) => void;
  isMaximized?: boolean;
  isStatic?: boolean;
  classnames?: Pick<ContentClasses, "header" | "headerButtons">;
  components?: Components<typeof defaultHeaderComponents>;
  className?: string;
}

const flexRow = css({
  display: "flex",
  alignItems: "stretch",
  flexDirection: "row",
});

export function WindowHeader({
  title,
  classnames,
  closeDialog,
  zoomDialog,
  isStatic,
  isMaximized,
  components = {},
  ...props
}: WindowHeaderProps) {
  const header = useMemo(
    () => <header className={cx(flexRow, css({ justifyContent: "space-between" }))} onDoubleClick={() => zoomDialog?.()} />,
    [zoomDialog],
  );

  const {
    HeaderButtonClose: Close,
    HeaderButtonZoom: Zoom,
    HeaderTitle: Title,
  } = useMemo(
    () => ({
      ...defaultHeaderComponents,
      ...components,
    }),
    [components],
  );

  return (
    <DragHandle el={header} disabled={isStatic || isMaximized} {...props}>
      {title ? <Title className={classnames.header}>{title}</Title> : <div />}
      <HeaderButtons className={cx(flexRow, classnames.headerButtons)}>
        {zoomDialog && <Zoom zoomDialog={zoomDialog} isMaximized={isMaximized} />}
        {closeDialog && <Close closeDialog={closeDialog} />}
      </HeaderButtons>
    </DragHandle>
  );
}
