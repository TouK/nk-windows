import { useCallback, useState } from "react";
import { useViewportSize } from "../../hooks";
import { Coords, Side, Size } from "./WindowFrame";

function box(x: number, y: number, w: number, h: number): Box {
  return { x: Math.round(x), y: Math.round(y), width: Math.round(w), height: Math.round(h) };
}

export interface Box extends Coords, Size {}

export function useSnapAreas(margin = 0, onSnap?: (box: Box) => void): [Box, (side: Side, isDropped: boolean) => void] {
  const { width, height } = useViewportSize();
  const [previewBox, setPreviewBox] = useState<Box | null>(null);

  const getBBox = useCallback(
    (side: Side): Box => {
      function points(fullSize, size) {
        const p0 = margin;
        const p1 = size;
        const p2 = fullSize - size;
        const p3 = fullSize - p0;

        const w0 = p3 - p0;
        const w1 = p1 - p0;
        const w2 = p3 - p2;
        return [p0, p2, w0, w1, w2];
      }

      const [x0, x2, wf, wl, wr] = points(width, width * 0.5 - margin / 2);
      const [y0, y2, hf, ht, hb] = points(height, height * 0.5 - margin / 2);

      switch (side) {
        case Side.top:
          return box(x0, y0, wf, ht);
        case Side.bottom:
          return box(x0, y2, wf, hb);
        case Side.left:
          return box(x0, y0, wl, hf);
        case Side.right:
          return box(x2, y0, wr, hf);
        case Side.topLeft:
          return box(x0, y0, wl, ht);
        case Side.topRight:
          return box(x2, y0, wr, ht);
        case Side.bottomLeft:
          return box(x0, y2, wl, hb);
        case Side.bottomRight:
          return box(x2, y2, wr, hb);
        default:
          return null;
      }
    },
    [height, width],
  );

  const onSideEdgeSnap = useCallback(
    (side: Side, isDropped: boolean) => {
      const bBox = getBBox(side);
      if (isDropped) {
        if (bBox) {
          onSnap?.(bBox);
        }
        setPreviewBox(null);
      } else {
        setPreviewBox(bBox);
      }
    },
    [getBBox, onSnap],
  );
  return [previewBox, onSideEdgeSnap];
}
