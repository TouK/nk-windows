import React from "react";
import { ObjectInspector } from "react-inspector";
import { useWindowContext } from "../components/window/WindowContent";
import { DemoDefaultContent } from "./demoDefaultContent";

function DemoContent2() {
  const ctx = useWindowContext();
  return (
    <DemoDefaultContent {...ctx} buttons={[{ title: "Cancel", action: () => ctx.close() }]}>
      <ObjectInspector expandLevel={1} data={ctx.data} />
    </DemoDefaultContent>
  );
}

export default DemoContent2;
