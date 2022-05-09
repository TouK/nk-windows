import React from "react";
import Inspector from "react-inspector";
import { DemoDefaultContent } from "./demoDefaultContent";
import { WindowContentProps } from "../index";

function LazyDemoContent(props: WindowContentProps) {
  return (
    <DemoDefaultContent {...props} buttons={[{ title: "Cancel", action: () => props.close() }]}>
      <Inspector expandLevel={1} data={props.data} />
    </DemoDefaultContent>
  );
}

export default LazyDemoContent;
