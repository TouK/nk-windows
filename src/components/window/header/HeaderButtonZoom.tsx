import React from "react";
import { HeaderButton } from "./HeaderButton";
import RestoreIcon from "./restore.svg";
import ZoomIcon from "./zoom.svg";

export interface HeaderButtonZoomProps {
  zoomDialog: (value?: boolean) => void;
  isMaximized: boolean;
}

export function HeaderButtonZoom({ zoomDialog, isMaximized }: HeaderButtonZoomProps): JSX.Element {
  return (
    <HeaderButton className="zoom" onClick={() => zoomDialog()}>
      {isMaximized ? <RestoreIcon /> : <ZoomIcon />}
    </HeaderButton>
  );
}
