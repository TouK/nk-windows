import React from "react";
import Inspector from "react-inspector";
import { DebugButtons } from "./debug";
import { DefaultContent, WindowContentProps, WindowManagerProvider } from "./index";

function contentGetter(props: WindowContentProps<any>) {
  return (
    <DefaultContent {...props}>
      <Inspector expandLevel={1} data={props.data} />
      <DebugButtons currentId={props.data.id} />
    </DefaultContent>
  );
}

const HelloWorld: React.FC = () => {
  return (
    <WindowManagerProvider
      contentGetter={contentGetter}
      theme={{
        colors: {
          focusColor: "#FF0000",
          primaryBackground: "#FFFFFF",
          secondaryBackground: "#CCCCCC",
          borderColor: "#000000",
          mutedColor: "#999999",
        },
      }}
    >
      <DebugButtons />
    </WindowManagerProvider>
  );
};

export default HelloWorld;
