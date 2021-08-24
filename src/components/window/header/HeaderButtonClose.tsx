import React from "react";
import CloseIcon from "./close.svg";
import { HeaderButton } from "./HeaderButton";

export interface HeaderButtonCloseProps {
  closeDialog: () => void;
}

export function HeaderButtonClose({ closeDialog }: HeaderButtonCloseProps): JSX.Element {
  return (
    <HeaderButton className="close" onClick={() => closeDialog()}>
      <CloseIcon />
    </HeaderButton>
  );
}
