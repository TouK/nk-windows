import { css, cx } from "emotion";

export const DRAG_HANDLE_CLASS_NAME = "drag-handle";

export function getDragHandleClass(isStatic: boolean) {
  return cx(
    css({
      userSelect: isStatic ? "none" : "auto",
      cursor: isStatic ? "auto" : "move",
    }),
    DRAG_HANDLE_CLASS_NAME,
  );
}
