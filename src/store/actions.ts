import { v4 as uuid } from "uuid";
import { WindowType } from "../types";
import { WMAction } from "./action";
import { getTopmostModal, getWindows } from "./selectors";

const timeout = (t = 0) => new Promise((resolve) => setTimeout(resolve, t));

const defaults: Partial<WindowType> = {
  isModal: true,
  isGlobal: false,
  isResizable: true,
  shouldCloseOnEsc: true,
};

export function openWindow<Kind extends number | string = any, Meta = never>({
  id = uuid(),
  ...data
}: Partial<WindowType<Kind, Meta>>): WMAction<Promise<WindowType<Kind, Meta>>> {
  const withDefaults = { ...defaults, ...data };
  const isModal = withDefaults.isModal && !withDefaults.isGlobal;
  return async (dispatch, getState) => {
    const state = getState();
    const windowData = {
      ...withDefaults,
      id,
      isModal,
      focusParent: isModal ? id : getTopmostModal(state),
    };

    await timeout(50);
    dispatch({ type: "OPEN_WINDOW", windowData });
    return windowData;
  };
}

export function closeWindow(id: string = null): WMAction {
  return async (dispatch, getState) => {
    const state = getState();
    dispatch({ type: "CLOSE_WINDOW", id });
    await Promise.all(
      getWindows(state)
        .filter((w) => w.parent === id && w.id !== id && w.id !== w.parent)
        .map(({ id }) => dispatch(closeWindow(id))),
    );
  };
}
