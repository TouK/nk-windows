import React, { createContext, PropsWithChildren, useEffect } from "react";
import { reducer, ReducerWithThunk, useReducerWithThunk } from "../store";

export const WindowManagerContext = createContext<ReducerWithThunk<typeof reducer>>(null);

export function WindowManagerContextProvider({ children }: PropsWithChildren<unknown>): JSX.Element {
  const [state, dispatch] = useReducerWithThunk(reducer, { windows: [], order: [] });

  // clear windows on unmount
  useEffect(() => () => dispatch({ type: "CLEAR_WINDOWS" }), [dispatch]);

  return <WindowManagerContext.Provider value={[state, dispatch]}>{children}</WindowManagerContext.Provider>;
}
