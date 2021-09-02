import { createSelector } from "reselect";
import { WindowId, WindowManagerState, WindowType } from "../types";

export function byId<T extends { id: I }, I = string>(id: T["id"]) {
  return (el: T): boolean => id === el.id;
}

const getWindowsState = (windowManager: WindowManagerState): WindowManagerState => windowManager || { windows: [], order: [] };
const getWindowId = (state: WindowManagerState, { id }: { id: WindowId }): WindowId => id;

export const getWindows = createSelector(getWindowsState, ({ windows }) => windows || []);

export const getWindow = createSelector(getWindows, getWindowId, (windows, id) => windows.find((w) => w.id === id));

const getOrder = createSelector(getWindowsState, ({ order }) => [...order].reverse());

export const getTopmostModal = createSelector(
  getWindowsState,
  ({ order, windows }): WindowId => order.find((id) => windows.find(byId(id))?.isModal),
);

export const getWindowsWithOrder = createSelector(
  getWindows,
  getOrder,
  <K extends number | string = any>(windows, order): Array<WindowType<K, any> & { order: number }> =>
    windows.map((data) => ({
      ...data,
      order: order.findIndex((id) => data.id === id),
    })),
);
