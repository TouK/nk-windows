import { useEffect, useRef } from "react";

export function useScrollFix(el: EventTarget) {
  const focused = useRef<HTMLElement>();
  const scrollTop = useRef<number>(null);

  useEffect(() => {
    const focusInHandler = (e) => {
      focused.current = e.target;
      scrollTop.current = window.document.documentElement.scrollTop;
    };
    const focusOutHandler = (e) => {
      focused.current = null;
      scrollTop.current = window.document.documentElement.scrollTop;
    };
    el?.addEventListener("focusin", focusInHandler);
    el?.addEventListener("focusout", focusOutHandler);
    return () => {
      el?.removeEventListener("focusin", focusInHandler);
      el?.removeEventListener("focusout", focusOutHandler);
    };
  }, [el]);

  useEffect(() => {
    const listener = (e) => {
      if ("visualViewport" in window && window.visualViewport.height !== window.innerHeight) {
        focused.current?.scrollIntoView();
        if (scrollTop !== null) {
          window.document.documentElement.scrollTop = scrollTop.current;
        }
      }
    };
    visualViewport?.addEventListener("scroll", listener);
    return () => {
      visualViewport?.removeEventListener("scroll", listener);
    };
  }, [el]);
}
