import { css, cx } from "@emotion/css";
import React, { useState } from "react";
import { useContentScroll } from "../components/window/content/OverflowContext";

export const OverflowDebug = () => {
  const [data, setData] = useState([]);
  const { hasTopOverflow, hasBottomOverflow, scrollToBottom, scrollToTop } = useContentScroll();

  const className1 = css({ margin: ".5em", filter: "invert(1)" });
  const className2 = css({ position: "sticky", top: 10, bottom: 10, fontWeight: "bold" });
  return (
    <>
      <button className={cx(className1, className2)} disabled={!hasTopOverflow()} onClick={scrollToTop}>
        scroll to top
      </button>
      <button className={cx(className1, className2)} disabled={!hasBottomOverflow()} onClick={scrollToBottom}>
        scroll to bottom
      </button>
      <button className={cx(className1)} onClick={() => setData((s) => [...s, "line"])}>
        add line
      </button>
      <button className={cx(className1)} onClick={() => setData([])}>
        clear
      </button>

      {data.map((e, i) => (
        <div className={css({ fontSize: "3em", margin: "1em" })} key={`${e}${i}`}>
          {e}
        </div>
      ))}
    </>
  );
};
