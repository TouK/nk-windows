import React, { ReactNode, UIEvent, useCallback, useRef } from "react";
import { HeaderButton } from "./HeaderButton";
import RestoreIcon from "./restore.svg";
import ZoomIcon from "./zoom.svg";

export interface HeaderButtonZoomProps {
  zoomDialog: (value?: boolean) => void;
  isMaximized: boolean;
  keepFocus?: boolean;
}

export function HeaderButtonZoom({ zoomDialog, isMaximized, keepFocus }: HeaderButtonZoomProps): ReactNode {
  const ref = useRef<HTMLButtonElement>();
  const action = useCallback(
    (event: UIEvent) => {
      event.preventDefault();

      zoomDialog();
      if (!keepFocus) {
        ref.current?.blur();
      }
    },
    [keepFocus, zoomDialog],
  );

  return (
    <HeaderButton name="zoom" ref={ref} action={action}>
      {isMaximized ? <RestoreIcon /> : <ZoomIcon />}
    </HeaderButton>
  );
}
