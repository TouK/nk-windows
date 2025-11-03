import React, { ReactNode, useMemo } from "react";
import { useWindowManager } from "../hooks";
import { WindowId, WindowType } from "../types";
import { DemoWindowKind } from "./DemoWindowKind";

export function DebugButtons({ currentId }: { currentId?: WindowId }): ReactNode {
  const { open, close, closeAll } = useWindowManager<DemoWindowKind | string>(currentId);

  const buttons: Partial<WindowType>[] = useMemo(
    () => [
      undefined,
      { title: "with title" },
      { title: "danger", kind: DemoWindowKind.danger },
      { title: "danger, maximized", kind: DemoWindowKind.danger, isMaximized: true },
      { title: "danger, maximized, non-resizable", kind: DemoWindowKind.danger, isMaximized: true, isResizable: false },
      { title: "danger, non-resizable", kind: DemoWindowKind.danger, isResizable: false },
      { title: "not modal", isModal: false },
      { title: "lazy loaded content", kind: DemoWindowKind.lazy },
      { title: "initial size", kind: DemoWindowKind.lazy, layoutData: { width: 700, height: 700 } },
      { title: "minimal size (overflow fixed)", kind: DemoWindowKind.danger, layoutData: { width: 7000, height: 7000 } },
      { title: `initial position`, layoutData: { top: 50, left: 200, right: 50, bottom: 200 } },
      {
        title: "global",
        kind: DemoWindowKind.empty,
        layoutData: { top: 50, left: 50, width: 200, height: 200 },
        isGlobal: true,
      },
      { title: `fixed id`, id: "fixed", parent: null },
    ],
    [],
  );

  return (
    <div>
      {buttons.map((data, index) => (
        <span key={index}>
          <button onClick={() => open(data)} style={{ fontWeight: "bold", color: "black", margin: ".5em" }}>
            add({data?.title || ""})
          </button>
        </span>
      ))}
      <button style={{ margin: ".5em" }} onClick={() => closeAll()}>
        close all
      </button>
      <button style={{ margin: ".5em" }} disabled={!currentId} onClick={() => close()}>
        close
      </button>
      <div>
        <p>test focus and onscreen keyboard</p>
        <input type="text" />
      </div>
    </div>
  );
}
