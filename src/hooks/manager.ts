import { useCallback, useContext, useMemo } from "react";
import { WindowManagerContext } from "../context";
import { closeWindow, focusWindow, getWindowsWithOrder, openWindow } from "../store";
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

export function useWindowManager<K extends number | string = any>(parent?: WindowId) {
  const [state, dispatch] = useContext(WindowManagerContext);

  const open = useCallback(
    <Kind extends number | string = K, Meta = never>(windowData: Partial<WindowType<Kind, Meta>> = {}) => {
      return dispatch(openWindow({ parent, ...windowData }));
    },
    [dispatch, parent],
  );

  const focus = useCallback(
    (id: WindowId = parent) => {
      dispatch(focusWindow(id));
    },
    [dispatch, parent],
  );

  const close = useCallback(
    async (id: WindowId = parent) => {
      await dispatch(closeWindow(id));
      return id;
    },
    [dispatch, parent],
  );

  const windows = useMemo(() => getWindowsWithOrder(state), [state]);

  const closeAll = useCallback(
    async (w = windows) => {
      return await Promise.all(w.map(({ id }) => close(id)));
    },
    [close, windows],
  );

  return { windows, open, focus, close, closeAll };
}
