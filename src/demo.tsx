import React from "react";
import { name, version } from "../package.json";
import { ContentGetter } from "./demo/contentGetter";
import { DebugButtons } from "./demo/DebugButtons";
import { DemoWindowKind } from "./demo/DemoWindowKind";
import { WindowManagerProvider } from "./index";

const Header: React.FC = () => {
  if (window["Cypress"]) return null;

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
