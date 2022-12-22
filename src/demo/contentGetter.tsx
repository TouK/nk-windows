import loadable from "@loadable/component";
import React from "react";
import { DefaultContentProps } from "../components/window/DefaultContent";
import DemoContent from "./demoContent";
import { DemoWindowKind } from "./DemoWindowKind";

const LazyDemoContent = loadable(
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return import("./lazyDemoContent");
  },
  { fallback: <h1>loading...</h1> },
);

export function ContentGetter(props: Omit<DefaultContentProps, "buttons">) {
  switch (props.data.kind) {
    case DemoWindowKind.lazy:
      return <LazyDemoContent {...props} />;
    default:
      return <DemoContent {...props} />;
  }
}
