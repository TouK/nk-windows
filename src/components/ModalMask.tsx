import { css, cx } from "@emotion/css";
import React, { forwardRef, ReactNode, RefObject } from "react";
import { rgba } from "../rgba";
import { useModalMaskTheme } from "../themeHooks";

export const ModalMask = forwardRef(({ zIndex }: { zIndex?: number }, ref: RefObject<HTMLDivElement>): ReactNode => {
  const modalMaskTheme = useModalMaskTheme();
  const modalMaskClass = css({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "fixed",
    background: rgba("black", 0.6),
  });
  return <div ref={ref} className={cx(modalMaskClass, modalMaskTheme)} style={{ zIndex }} />;
});

ModalMask.displayName = "ModalMask";
