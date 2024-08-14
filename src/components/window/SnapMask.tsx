import { useTheme } from "@emotion/react";
import React, { useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { rgba } from "../../rgba";
import { fastFadeAnimation } from "../getFadeInAnimation";
import { Box } from "./useSnapAreas";

export const SnapMask = ({ previewBox }: { previewBox: Box }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const {
    colors,
    spacing: { baseUnit },
  } = useTheme();

  return (
    <TransitionGroup>
      {previewBox && (
        <CSSTransition nodeRef={nodeRef} timeout={250} classNames={fastFadeAnimation}>
          <div
            ref={nodeRef}
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
