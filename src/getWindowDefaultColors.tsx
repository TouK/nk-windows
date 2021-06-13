import { css } from "emotion";
import { WindowKind } from "./types";

export function getWindowDefaultColors(type: WindowKind = WindowKind.default): string {
  switch (type) {
    case WindowKind.danger:
      return css({ backgroundColor: "#A82121", color: "white" });
    case WindowKind.default:
    default:
      return css({ backgroundColor: "#2D8E54", color: "white" });
  }
}
