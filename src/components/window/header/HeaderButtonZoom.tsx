import React, { useCallback, useRef } from "react";
import { HeaderButton } from "./HeaderButton";
import RestoreIcon from "./restore.svg";
import ZoomIcon from "./zoom.svg";

export interface HeaderButtonZoomProps {
  zoomDialog: (value?: boolean) => void;
  isMaximized: boolean;
  keepFocus?: boolean;
}

export function HeaderButtonZoom({ zoomDialog, isMaximized, keepFocus }: HeaderButtonZoomProps): JSX.Element {
  const ref = useRef<HTMLButtonElement>();
  const onPointerDown = useCallback(() => {
    zoomDialog();
    if (!keepFocus) {
      // ref.current?.blur();
    }
  }, [keepFocus, zoomDialog]);

  return (
    <HeaderButton name="zoom" ref={ref} onPointerDown={onPointerDown}>
      {isMaximized ? <RestoreIcon /> : <ZoomIcon />}
    </HeaderButton>
  );
}
