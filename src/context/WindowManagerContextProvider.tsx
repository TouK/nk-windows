import React, { createContext, PropsWithChildren, useEffect } from "react";
import { useDebouncedValue } from "rooks";
import { reducer, ReducerWithThunk, useReducerWithThunk } from "../store";

export const WindowManagerContext = createContext<ReducerWithThunk<typeof reducer>>(null);

export function WindowManagerContextProvider({ children }: PropsWithChildren<unknown>): JSX.Element {
  const [state, dispatch] = useReducerWithThunk(reducer, { windows: [], order: [] });
  const [debouncedState] = useDebouncedValue(state, 50);
  // clear windows on unmount
  useEffect(() => () => dispatch({ type: "CLEAR_WINDOWS" }), [dispatch]);

  return <WindowManagerContext.Provider value={[debouncedState, dispatch]}>{children}</WindowManagerContext.Provider>;
}
