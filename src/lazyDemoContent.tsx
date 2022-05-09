import React from "react";
import Inspector from "react-inspector";
import { DefaultContent } from "./components/window/DefaultContent";
import { WindowContentProps } from "./components/window/WindowContentProps";

function LazyDemoContent(props: WindowContentProps) {
  return (
    <DefaultContent {...props} buttons={[{ title: "Cancel", action: () => props.close() }]}>
      <Inspector expandLevel={1} data={props.data} />
    </DefaultContent>
  );
}

export default LazyDemoContent;
