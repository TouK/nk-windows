import React, { createContext, PropsWithChildren, ReactNode, useEffect } from "react";
import { closeWindows, reducer, ReducerWithThunk, useReducerWithThunk } from "../store";

export const WindowManagerContext = createContext<ReducerWithThunk<typeof reducer>>(null);

export function WindowManagerContextProvider({ children }: PropsWithChildren<unknown>): ReactNode {
  const [state, dispatch] = useReducerWithThunk(reducer, { windows: [], order: [] });
  // clear windows on unmount
  useEffect(() => () => dispatch(closeWindows()), [dispatch]);

  return <WindowManagerContext.Provider value={[state, dispatch]}>{children}</WindowManagerContext.Provider>;
}
