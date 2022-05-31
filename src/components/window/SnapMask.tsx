import { useTheme } from "@emotion/react";
import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { rgba } from "../../rgba";
import { getFadeInAnimation } from "../getFadeInAnimation";
import { Box } from "./useSnapAreas";

const fadeInAnimation = getFadeInAnimation(0.15);

export const SnapMask = ({ previewBox }: { previewBox: Box }) => {
  const {
    colors,
    spacing: { baseUnit },
  } = useTheme();

  return (
    <TransitionGroup>
      {previewBox && (
        <CSSTransition timeout={250} classNames={fadeInAnimation}>
          <div
            style={{
              boxSizing: "border-box",
              position: "fixed",
              zIndex: 10,
              background: rgba(colors.focusColor, 0.25),
              border: `${Math.round(baseUnit / 3)}px solid ${colors?.focusColor}`,
              top: previewBox.y,
              left: previewBox.x,
              width: previewBox.width,
              height: previewBox.height,
              transition: "all .15s ease-in-out",
            }}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};
