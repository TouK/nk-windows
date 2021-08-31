import React, { useState } from "react";
import Inspector from "react-inspector";
import { DebugButtons } from "./debug";
import { DefaultContent, WindowContentProps, WindowManagerProvider } from "./index";

function ContentGetter(props: WindowContentProps<any>) {
  const [state, setState] = useState(["test"]);
  return (
    <DefaultContent
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
      <button onClick={() => setState((s) => [...s, Math.random().toString()])}>add</button>
      <button onClick={() => setState([])}>add</button>
      {state.map((e) => (
        <p key={e}>{e}</p>
      ))}
    </DefaultContent>
  );
}

const HelloWorld: React.FC = () => {
  return (
    <WindowManagerProvider
      contentGetter={ContentGetter}
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
