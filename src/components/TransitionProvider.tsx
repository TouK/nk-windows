import React, { createContext, PropsWithChildren, useCallback, useContext } from "react";
import { useTransitionMap } from "react-transition-state";
import { defaultFadeAnimation, FadeInAnimation } from "./getFadeInAnimation";
import { WindowId } from "../types";

const TRANSITION_TIMEOUT = 100;
const transitionsAnimationTime = new Map<string, number>();
const TransitionContext = createContext<{
  startTransition: (id: string) => Promise<boolean>;
  finishTransition: (id: string) => Promise<boolean>;
  getTransitionStyle: (id: string, fadeInAnimation?: FadeInAnimation) => string[];
}>(null);

export const TransitionProvider = ({ children }: PropsWithChildren) => {
  const transition = useTransitionMap({
    timeout: TRANSITION_TIMEOUT,
    exit: true,
    preExit: false,
    allowMultiple: true,
  });

  const getTransitionStyle = useCallback(
    (id: WindowId, fadeInAnimation: FadeInAnimation = defaultFadeAnimation) => {
      transitionsAnimationTime.set(id, fadeInAnimation.animationTime * 1000);
      const transitionItem = transition.stateMap.get(id);
      const entered = transitionItem.status === "entered" && fadeInAnimation.entered;
      const exited = transitionItem.status === "exited" && fadeInAnimation.exited;

      return [fadeInAnimation.mounted, entered, exited];
    },
    [transition.stateMap],
  );

  const startTransition = useCallback(
    (id: WindowId) => {
      return new Promise<boolean>((resolve) => {
        transition.setItem(id);
        transition.toggle(id, true);
        const transitionAnimationTime = transitionsAnimationTime.get(id);

        setTimeout(() => {
          resolve(true);
        }, TRANSITION_TIMEOUT + transitionAnimationTime);
      });
    },
    [transition],
  );

  const finishTransition = useCallback(
    (id: WindowId) => {
      return new Promise<boolean>((resolve) => {
        transition.toggle(id, false);
        const transitionAnimationTime = transitionsAnimationTime.get(id);
        setTimeout(() => {
          transition.deleteItem(id);
          transitionsAnimationTime.delete(id);
          resolve(true);
        }, TRANSITION_TIMEOUT + transitionAnimationTime);
      });
    },
    [transition],
  );

  return (
    <TransitionContext.Provider value={{ startTransition, finishTransition, getTransitionStyle }}>{children}</TransitionContext.Provider>
  );
};

export const useTransition = () => {
  const context = useContext(TransitionContext);

  if (!context) {
    throw new Error();
  }

  return context;
};
