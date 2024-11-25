import { css, cx } from "@emotion/css";
import React from "react";
import { rgba } from "../rgba";
import { useModalMaskTheme } from "../themeHooks";
import { WindowId } from "../types";
import { useTransition } from "./TransitionProvider";

export const ModalMask = ({ zIndex, id }: { zIndex?: number; id: WindowId }): JSX.Element => {
  const modalMaskTheme = useModalMaskTheme();
  const modalMaskClass = css({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "fixed",
    background: rgba("black", 0.6),
  });
  const { getTransitionStyle } = useTransition();

  return <div className={cx(modalMaskClass, modalMaskTheme, ...getTransitionStyle(id))} style={{ zIndex }} />;
};
