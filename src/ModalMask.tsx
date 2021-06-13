import { css, cx } from "emotion";
import React from "react";
import { rgba } from "./rgba";
import { useModalMaskTheme } from "./themeHooks";

export function ModalMask({ zIndex }: { zIndex?: number }): JSX.Element {
  const modalMaskTheme = useModalMaskTheme();
  const modalMaskClass = css({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "fixed",
    background: rgba("black", 0.6),
  });
  return <div className={cx(modalMaskClass, modalMaskTheme)} style={{ zIndex }} />;
}
