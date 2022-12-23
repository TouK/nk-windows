import React from "react";
import Inspector from "react-inspector";
import { WindowContentProps } from "../index";
import { DebugButtons } from "./DebugButtons";
import { DemoDefaultContent } from "./demoDefaultContent";
import { OverflowDebug } from "./overflowDebug";

function DemoContent(props: WindowContentProps) {
  return (
    <DemoDefaultContent
      {...props}
      buttons={[
        { title: "Cancel", action: () => props.close() },
        {
          title: "Success",
          action: async () => {
            await new Promise((resolve, reject) => {
              setTimeout(resolve, 2000);
            });
            props.close();
          },
        },
        {
          title: "Fail",
          action: async () => {
            await new Promise((resolve, reject) => {
              setTimeout(reject, 2000);
            });
            props.close();
          },
        },
      ]}
    >
      <Inspector expandLevel={1} data={props.data} />
      <DebugButtons currentId={props.data.id} />
      <OverflowDebug />
    </DemoDefaultContent>
  );
}

export default DemoContent;
