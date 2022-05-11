import { css } from "@emotion/css";
import { DemoWindowKind } from "./DemoWindowKind";

export function getWindowDemoColors(type: DemoWindowKind = DemoWindowKind.default): string {
  switch (type) {
    case DemoWindowKind.danger:
      return css({ backgroundColor: "#A82121", color: "white" });
    case DemoWindowKind.lazy:
      return css({ backgroundColor: "#2165a8", color: "white" });
    case DemoWindowKind.default:
    default:
      return css({ backgroundColor: "#2D8E54", color: "white" });
  }
}
