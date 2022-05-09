import { css, cx } from "@emotion/css";
import React, { useState } from "react";
import Inspector from "react-inspector";
import { useOverflow } from "./components/window/content/OverflowContext";
import { DefaultContent } from "./components/window/DefaultContent";
import { WindowContentProps } from "./components/window/WindowContentProps";
import { DebugButtons } from "./debug";

const OverflowDebug = () => {
  const [data, setData] = useState([]);
  const { scrollToBottom, scrollToTop } = useOverflow();

  const className1 = css({ margin: ".5em", filter: "invert(1)" });
  const className2 = css({ position: "sticky", top: 10, bottom: 10, fontWeight: "bold" });
  return (
    <>
      <button className={cx(className1, className2)} disabled={!scrollToTop} onClick={scrollToTop}>
        scroll to top
      </button>
      <button className={cx(className1, className2)} disabled={!scrollToBottom} onClick={scrollToBottom}>
        scroll to bottom
      </button>
      <button className={cx(className1)} onClick={() => setData((s) => [...s, Math.random().toString()])}>
        add line
      </button>
      <button className={cx(className1)} onClick={() => setData([])}>
        clear
      </button>

      {data.map((e) => (
        <p key={e}>{e}</p>
      ))}
    </>
  );
};

function DemoContent(props: WindowContentProps) {
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
      <OverflowDebug />
    </DefaultContent>
  );
}

export default DemoContent;
