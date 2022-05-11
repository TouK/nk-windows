import React, { MutableRefObject, useCallback } from "react";
import { useViewportSize } from "../../hooks";
import { Side } from "./WindowFrame";

export function useSnapSide(ref: MutableRefObject<HTMLDivElement | undefined>) {
  const viewport = useViewportSize();
  return useCallback(
    (threshold = 15): Side => {
      const { top, left, right, bottom } = ref.current?.getBoundingClientRect();

      let side = Side.none;
      if (top <= threshold) {
        side |= Side.top;
      }
      if (Math.round(viewport?.height - bottom) <= threshold) {
        side |= Side.bottom;
      }
      if (left <= threshold) {
        side |= Side.left;
      }
      if (Math.round(viewport?.width - right) <= threshold) {
        side |= Side.right;
      }
      return side;
    },
    [ref, viewport?.height, viewport?.width],
  );
}
