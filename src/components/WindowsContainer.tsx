import React, { createRef } from "react";
import { createPortal } from "react-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useWindowManager } from "../hooks";
import { defaultFadeAnimation } from "./getFadeInAnimation";
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
    <TransitionGroup component={WindowsViewport}>
      {windows
        .flatMap((d) => {
          const modalMaskRef = createRef<HTMLDivElement>();
          const windowRef = createRef<HTMLDivElement>();
          return [
            d.isModal && (
              <CSSTransition nodeRef={modalMaskRef} key={`${d.id}/mask`} timeout={250} classNames={defaultFadeAnimation}>
                <ModalMask ref={modalMaskRef} key={`${d.id}/mask`} zIndex={d.maskOrder} />
              </CSSTransition>
            ),
            <CSSTransition nodeRef={windowRef} key={d.id} timeout={250} classNames={defaultFadeAnimation}>
              <Window ref={windowRef} data={d} contentGetter={contentGetter} />
            </CSSTransition>,
          ];
        })
        .filter(Boolean)}
    </TransitionGroup>,
    container,
  );
}
