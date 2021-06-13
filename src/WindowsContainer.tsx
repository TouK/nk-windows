import { css } from "emotion";
import { flatMap } from "lodash";
import React from "react";
import { createPortal } from "react-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useWindowManager } from "./hooks";
import { ModalMask } from "./ModalMask";
import { WindowType } from "./types";
import { Window } from "./Window";
import { ContentGetter } from "./WindowContent";
import { WindowsViewport } from "./WindowsViewport";

const fadeInAnimation = {
  enter: css({
    opacity: 0,
  }),
  enterActive: css({
    opacity: 1,
    transition: "opacity 250ms ease-in-out",
    pointerEvents: "none",
  }),
  exit: css({
    opacity: 1,
  }),
  exitActive: css({
    opacity: 0,
    transition: "opacity 250ms ease-in-out",
    pointerEvents: "none",
  }),
};

interface WindowsContainerProps {
  container?: HTMLElement;
  contentGetter: ContentGetter;
}

export function WindowsContainer({ container = document.body, contentGetter }: WindowsContainerProps): JSX.Element {
  const { windows } = useWindowManager();
  return createPortal(
    <TransitionGroup component={WindowsViewport}>
      {flatMap(windows, (d, index) => [
        d.isModal && (
          <CSSTransition key={`${d.id}/mask`} timeout={250} classNames={fadeInAnimation}>
            <ModalMask key={`${d.id}/mask`} zIndex={index} />
          </CSSTransition>
        ),
        <CSSTransition key={d.id} timeout={250} classNames={fadeInAnimation}>
          <Window data={d} contentGetter={contentGetter} />
        </CSSTransition>,
      ]).filter(Boolean)}
    </TransitionGroup>,
    container,
  );
}
