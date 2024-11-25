import { useCallback, useContext, useMemo } from "react";
import { WindowManagerContext } from "../context";
import { closeWindow, getWindowsWithOrder, openWindow } from "../store";
import { WindowId, WindowManagerState, WindowType } from "../types";
import { ViewportContext, ViewportContextType } from "../ViewportContext";
import { useTransition } from "../components/TransitionProvider";
import { v4 as uuid } from "uuid";

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
  const transition = useTransition();
  const open = useCallback(
    async <Kind extends number | string = K, Meta = never>(windowData: Partial<WindowType<Kind, Meta>> = {}) => {
      const windowId: WindowId = windowData.id || uuid();
      await transition.startTransition(windowId);
      return dispatch(openWindow({ parent, ...windowData, id: windowId }));
    },
    [dispatch, parent, transition],
  );

  const focus = useCallback(
    (id: WindowId = parent) => {
      dispatch({ type: "FOCUS_WINDOW", id });
    },
    [dispatch, parent],
  );

  const close = useCallback(
    async (id: WindowId = parent) => {
      await transition.finishTransition(id);
      await dispatch(closeWindow(id));
      return id;
    },
    [dispatch, parent, transition],
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
