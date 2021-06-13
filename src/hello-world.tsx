import React from "react";
import Inspector from "react-inspector";
import { DebugButtons } from "./debug";
import { DefaultContent } from "./DefaultContent";
import { WindowContentProps } from "./WindowContentProps";
import { WindowManager } from "./WindowManager";

function contentGetter(props: WindowContentProps<any>) {
  return (
    <DefaultContent {...props}>
      <Inspector expandLevel={1} data={props.data} />
      <DebugButtons currentId={props.data.id} />
    </DefaultContent>
  );
}

const HelloWorld: React.FC = () => {
  const theme = { spacing: {}, colors: { primaryColor: "#ff0000", primaryBackground: "#FFFFFF", borderColor: "#000000" } };
  return (
    <WindowManager contentGetter={contentGetter} theme={theme}>
      <DebugButtons />
    </WindowManager>
  );
};

export default HelloWorld;
