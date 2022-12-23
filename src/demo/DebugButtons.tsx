import React, { useMemo } from "react";
import { useWindowManager } from "../hooks";
import { WindowId } from "../types";
import { DemoWindowKind } from "./DemoWindowKind";

export function DebugButtons({ currentId }: { currentId?: WindowId }): JSX.Element {
  const { open, close, closeAll } = useWindowManager<DemoWindowKind | string>(currentId);

  const buttons = useMemo(
    () => [
      undefined,
      { title: "with title" },
      { title: "danger", kind: DemoWindowKind.danger },
      { title: "danger, maximized", kind: DemoWindowKind.danger, isMaximized: true },
      { title: "danger, maximized, non-resizable", kind: DemoWindowKind.danger, isMaximized: true, isResizable: false },
      { title: "danger, non-resizable", kind: DemoWindowKind.danger, isResizable: false },
      { title: "not modal", isModal: false },
      { title: "lazy loaded content", kind: DemoWindowKind.lazy },
    ],
    [],
  );

  return (
    <div>
      {buttons.map((props, index) => (
        <div key={index}>
          <button onClick={() => open(props)} style={{ fontWeight: "bold", color: "black", margin: ".5em" }}>
            add({JSON.stringify(props)})
          </button>
        </div>
      ))}
      <button style={{ margin: ".5em" }} onClick={() => closeAll()}>
        close all
      </button>
      <button style={{ margin: ".5em" }} disabled={!currentId} onClick={() => close()}>
        close
      </button>
    </div>
  );
}
