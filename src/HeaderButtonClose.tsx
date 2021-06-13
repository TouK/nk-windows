import React from "react";
import CloseIcon from "./delete.svg";
import { HeaderButton } from "./HeaderButton";

export function HeaderButtonClose({ closeDialog }: { closeDialog: () => void }): JSX.Element {
  return (
    <HeaderButton onClick={() => closeDialog()}>
      <CloseIcon />
    </HeaderButton>
  );
}
