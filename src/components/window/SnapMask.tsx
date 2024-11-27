import { useTheme } from "@emotion/react";
import React from "react";
import { rgba } from "../../rgba";
import { Box } from "./useSnapAreas";

export const SnapMask = ({ previewBox }: { previewBox: Box }) => {
  const {
    colors,
    spacing: { baseUnit },
  } = useTheme();

  return (
    <>
      {previewBox && (
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
      )}
    </>
  );
};
