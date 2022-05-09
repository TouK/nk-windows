import loadable from "@loadable/component";
import React from "react";
import { DebugButtons } from "./debug";
import { WindowContentProps, WindowManagerProvider } from "./index";
import DemoContent from "./demoContent";

const LazyDemoContent = loadable(
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return import("./lazyDemoContent");
  },
  { fallback: <h1>loading...</h1> },
);

export function ContentGetter(props: WindowContentProps) {
  if (props.data.kind === "lazy") {
    return <LazyDemoContent {...props} />;
  }
  return <DemoContent {...props} />;
}

const Demo: React.FC = () => {
  return (
    <WindowManagerProvider
      contentGetter={(props) => ContentGetter(props)}
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
