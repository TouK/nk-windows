import React from "react";
import { ContentGetter } from "./demo/contentGetter";
import { DebugButtons } from "./demo/DebugButtons";
import { DemoWindowKind } from "./demo/DemoWindowKind";
import { WindowManagerProvider } from "./index";

const Demo: React.FC = () => {
  return (
    <WindowManagerProvider<DemoWindowKind>
      contentGetter={ContentGetter}
      theme={{
        colors: {
          focusColor: "#FF0000",
        },
      }}
    >
      <DebugButtons />
    </WindowManagerProvider>
  );
};

export default Demo;
