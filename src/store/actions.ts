import { v4 as uuid } from "uuid";
import { WindowType } from "../types";
import { WMAction } from "./action";
import { getTopmostModal, getWindows } from "./selectors";

const timeout = (t = 0) => new Promise((resolve) => setTimeout(resolve, t));

const defaults: Partial<WindowType> = {
  isModal: true,
  isResizable: true,
  shouldCloseOnEsc: true,
};

export function openWindow<Kind extends number | string = any, Meta = never>({
  id = uuid(),
  ...data
}: Partial<WindowType<Kind, Meta>>): WMAction<Promise<WindowType<Kind, Meta>>> {
  const withDefaults = { ...defaults, ...data };
  return async (dispatch, getState) => {
    const state = getState();
    const windowData = {
      ...withDefaults,
      id,
      focusParent: withDefaults.isModal ? id : getTopmostModal(state),
    };

    await timeout(50);
    dispatch({ type: "OPEN_WINDOW", windowData });
    return windowData;
  };
}

export function closeWindow(id: string = null): WMAction {
  return async (dispatch, getState) => {
    const state = getState();
    await Promise.all(
      getWindows(state)
        .filter(({ parent }) => parent === id)
        .map(({ id }) => dispatch(closeWindow(id))),
    );
    return await dispatch({ type: "CLOSE_WINDOW", id });
  };
}
