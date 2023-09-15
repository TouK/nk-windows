import React, { useEffect } from "react";
import { ObjectInspector } from "react-inspector";
import { useViewportSize } from "../hooks";
import { useWindowContext } from "../index";
import { DebugButtons } from "./DebugButtons";
import { DemoDefaultContent } from "./demoDefaultContent";
import { OverflowDebug } from "./overflowDebug";

function DemoContent() {
  const ctx = useWindowContext();
  const v = useViewportSize();
  return (
    <DemoDefaultContent
      {...ctx}
      buttons={[
        { title: "Cancel", action: () => ctx.close() },
        {
          title: "Success",
          action: async () => {
            await new Promise((resolve, reject) => {
              setTimeout(resolve, 2000);
            });
            ctx.close();
          },
        },
        {
          title: "Fail",
          action: async () => {
            await new Promise((resolve, reject) => {
              setTimeout(reject, 2000);
            });
            ctx.close();
          },
        },
      ]}
    >
      <ObjectInspector expandLevel={1} data={ctx.data} />
      <DebugButtons currentId={ctx.data.id} />
      <OverflowDebug />
    </DemoDefaultContent>
  );
}

export default DemoContent;
