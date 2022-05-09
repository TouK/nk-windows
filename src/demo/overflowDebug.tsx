import { css, cx } from "@emotion/css";
import React, { useState } from "react";
import { useOverflow } from "../components/window/content/OverflowContext";

export const OverflowDebug = () => {
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
