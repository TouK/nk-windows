import { v4 as uuid } from "uuid";
import { WindowType } from "../types";
import { WMAction } from "./action";
import { getTopmostModal, getWindows } from "./selectors";

const defaults: Partial<WindowType> = {
  isModal: true,
  isResizable: true,
  shouldCloseOnEsc: true,
};

export function openWindow<Kind extends number | string = any, Meta = never>({
  id = uuid(),
  ...data
}: Partial<WindowType<Kind, Meta>>): WMAction<WindowType<Kind, Meta>> {
  const withDefaults = { ...defaults, ...data };
  return (dispatch, getState) => {
    const state = getState();
    const windowData = {
      ...withDefaults,
      id,
      focusParent: withDefaults.isModal ? id : getTopmostModal(state),
    };

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
    dispatch({ type: "CLOSE_WINDOW", id });
  };
}
