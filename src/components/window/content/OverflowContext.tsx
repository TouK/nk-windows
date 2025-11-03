import { createContext, useContext, useMemo, useRef } from "react";

export interface Ctx {
  scrollTo: ((top: number) => void) | null;
  scrollToTop: (() => void) | null;
  scrollToBottom: (() => void) | null;
}

export const OverflowContext = createContext<Ctx>({
  scrollTo: null,
  scrollToTop: null,
  scrollToBottom: null,
});

/**
 * @deprecated use useContentScroll
 */
export function useOverflow(): Ctx {
  const context = useContext(OverflowContext);
  if (!context) {
    throw new Error("used outside OverflowContext.Provider");
  }
  return context;
}

export function useContentScroll() {
  const context = useOverflow();
  const ctxRef = useRef(context);
  ctxRef.current = context;

  return useMemo(() => {
    return {
      scrollTo: (top: number) => ctxRef.current?.scrollTo?.(top),
      scrollToTop: () => ctxRef.current?.scrollToTop?.(),
      scrollToBottom: () => ctxRef.current?.scrollToBottom?.(),
      hasBottomOverflow: () => Boolean(ctxRef.current?.scrollToBottom),
      hasTopOverflow: () => Boolean(ctxRef.current?.scrollToTop),
    };
  }, []);
}
