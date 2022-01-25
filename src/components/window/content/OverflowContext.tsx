import { createContext, useContext } from "react";

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

export function useOverflow(): Ctx {
  const context = useContext(OverflowContext);
  if (!context) {
    throw new Error("used outside OverflowContext.Provider");
  }
  return context;
}
