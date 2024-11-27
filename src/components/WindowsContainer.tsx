import { flatMap } from "lodash";
import React, { useRef } from "react";
import { createPortal } from "react-dom";
import { useWindowManager } from "../hooks";
import { ModalMask } from "./ModalMask";
import { Window } from "./window/Window";
import { ContentGetter } from "./window/WindowContent";
import { WindowsViewport } from "./WindowsViewport";

interface WindowsContainerProps {
  container?: HTMLElement;
  contentGetter: ContentGetter;
}

export function WindowsContainer({ container = document.body, contentGetter }: WindowsContainerProps): JSX.Element {
  const { windows } = useWindowManager();

  return createPortal(
    <WindowsViewport>
      {flatMap(windows, (d, index) => [
        d.isModal && <ModalMask zIndex={index} key={`${d.id}/mask`} id={d.id} />,
        <Window key={d.id} data={d} contentGetter={contentGetter} />,
      ]).filter(Boolean)}
    </WindowsViewport>,
    container,
  );
}
