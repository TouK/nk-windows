import { flatMap } from "lodash";
import React from "react";
import { createPortal } from "react-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useWindowManager } from "../hooks";
import { getFadeInAnimation } from "./getFadeInAnimation";
import { ModalMask } from "./ModalMask";
import { Window } from "./window/Window";
import { ContentGetter } from "./window/WindowContent";
import { WindowsViewport } from "./WindowsViewport";

export const fadeInAnimation = getFadeInAnimation();

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
