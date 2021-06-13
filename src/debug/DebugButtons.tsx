import React, { useMemo } from "react";
import { useWindowManager } from "../hooks";
import { WindowId, WindowKind } from "../types";

export function DebugButtons({ currentId }: { currentId?: WindowId }): JSX.Element {
  const { open, close, closeAll } = useWindowManager(currentId);

  const buttons = useMemo(
    () => [
      undefined,
      { title: "with title" },
      { title: "danger", kind: WindowKind.danger },
      { title: "danger, maximized", kind: WindowKind.danger, isMaximized: true },
      { title: "danger, maximized, non-resizable", kind: WindowKind.danger, isMaximized: true, isResizable: false },
      { title: "danger, non-resizable", kind: WindowKind.danger, isResizable: false },
      { title: "not modal", isModal: false },
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
