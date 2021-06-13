import { css, cx } from "emotion";
import React, { useMemo } from "react";
import { defaultHeaderComponents } from "./DefaultHeaderComponents";
import { DragHandle } from "./DragHandle";
import { HeaderButtons } from "./HeaderButtons";

interface WindowHeaderProps {
  title?: string;
  closeDialog?: () => void;
  zoomDialog?: (value?: boolean) => void;
  isMaximized?: boolean;
  isStatic?: boolean;
  className?: string;
  components?: Partial<typeof defaultHeaderComponents>;
}

const flexRow = css({
  display: "flex",
  alignItems: "stretch",
  flexDirection: "row",
});

export function WindowHeader({
  title,
  className,
  closeDialog,
  zoomDialog,
  isStatic,
  isMaximized,
  components = {},
}: WindowHeaderProps): JSX.Element {
  const el = useMemo(
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
    <DragHandle el={el} disabled={isStatic}>
      {title && <Title className={className}>{title}</Title>}
      <HeaderButtons className={cx(flexRow, css({ flexBasis: "0%" }))}>
        {zoomDialog && <Zoom zoomDialog={zoomDialog} isMaximized={isMaximized} />}
        {closeDialog && <Close closeDialog={closeDialog} />}
      </HeaderButtons>
    </DragHandle>
  );
}
