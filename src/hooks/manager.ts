import { useCallback, useContext, useMemo } from "react";
import { WindowManagerContext } from "../context";
import { closeWindow, getWindowsWithOrder, openWindow } from "../store";
import { WindowId, WindowManagerState, WindowType } from "../types";
import { ViewportContext, ViewportContextType } from "../ViewportContext";

export function useViewportSize(): ViewportContextType {
  const context = useContext(ViewportContext);
  if (!context) {
    throw new Error("used outside WindowManager");
  }
  return context;
}

export function useRawState<K extends number | string = any>(): WindowManagerState<K> {
  const [state] = useContext(WindowManagerContext);
  return state;
}

export function useWindowManager(parent?: WindowId) {
  const [state, dispatch] = useContext(WindowManagerContext);

  const open = useCallback(
    <Kind extends number | string = any, Meta extends any = never>(windowData: Partial<WindowType<Kind, Meta>> = {}) => {
      return dispatch(openWindow({ parent, ...windowData }));
    },
    [dispatch, parent],
  );

  const focus = useCallback(
    (id: WindowId = parent) => {
      dispatch({ type: "FOCUS_WINDOW", id });
    },
    [dispatch, parent],
  );

  const close = useCallback(
    (id: WindowId = parent) => {
      dispatch(closeWindow(id));
    },
    [dispatch, parent],
  );

  const windows = useMemo(() => getWindowsWithOrder(state), [state]);

  const closeAll = useCallback(
    (w = windows) => {
      w.forEach(({ id }) => dispatch(closeWindow(id)));
    },
    [dispatch, windows],
  );

  return { windows, open, focus, close, closeAll };
}
