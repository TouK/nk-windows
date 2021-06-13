import React from "react";
import { HeaderButton } from "./HeaderButton";
import ZoomIcon from "./zoom-in.svg";
import RestoreIcon from "./zoom-out.svg";

export function HeaderButtonZoom({
  zoomDialog,
  isMaximized,
}: {
  zoomDialog: (value?: boolean) => void;
  isMaximized: boolean;
}): JSX.Element {
  return <HeaderButton onClick={() => zoomDialog()}>{isMaximized ? <RestoreIcon /> : <ZoomIcon />}</HeaderButton>;
}
