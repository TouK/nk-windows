import React from "react";
import { ContentGetter } from "./demo/contentGetter";
import { DebugButtons } from "./demo/DebugButtons";
import { DemoWindowKind } from "./demo/DemoWindowKind";
import { WindowManagerProvider } from "./index";

const Header: React.FC = () => {
  if (window["Cypress"]) return null;

  // TODO: investigate why `resolveJsonModule` breaks type definition generation
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { name, version } = require("../package.json");

  return (
    <header style={{ fontFamily: "monospace" }}>
      <h1>{name}</h1>
      <h2>v{version}</h2>
    </header>
  );
};

const Demo: React.FC = () => {
  return (
    <WindowManagerProvider<DemoWindowKind>
      contentGetter={ContentGetter}
      theme={{
        colors: {
          focusColor: "#FF0000",
        },
      }}
    >
      <Header />
      <DebugButtons />
    </WindowManagerProvider>
  );
};

export default Demo;
