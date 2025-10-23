import { createSelector } from "reselect";
import { WindowId, WindowManagerState, WindowType } from "../types";

const getWindowsState = (windowManager: WindowManagerState): WindowManagerState => windowManager || { windows: [], order: [] };
const getWindowId = (state: WindowManagerState, { id }: { id: WindowId }): WindowId => id;

export const getWindows = createSelector(getWindowsState, ({ windows }): WindowType[] => windows);
export const getWindowsById = createSelector(
  getWindows,
  (windows: WindowType[]): Map<WindowId, WindowType> => new Map(windows.map((w) => [w.id, w])),
);

export const getWindow = createSelector(getWindowsById, getWindowId, (windows, id) => windows.get(id));

export const getOrder = createSelector(getWindowsState, getWindowsById, ({ order }, windows: Map<WindowId, WindowType>) => {
  const orderWithMasks = order.flatMap((id) => (windows.get(id)?.isModal ? [id, `${id}/mask`] : id));
  const lastModalIndex = orderWithMasks.findIndex((id) => id.endsWith("/mask"));

  if (lastModalIndex === -1) {
    return orderWithMasks.reverse();
  }

  const before = orderWithMasks.slice(0, lastModalIndex);
  const after = orderWithMasks.slice(lastModalIndex + 1);
  const move = after.filter((id) => windows.get(id)?.isGlobal);
  const stayAfter = after.filter((id) => !windows.get(id)?.isGlobal);
  return [...before, ...move, orderWithMasks[lastModalIndex], ...stayAfter].reverse();
});

export const getTopmostModal = createSelector(getWindowsState, getWindowsById, ({ order }, windows): WindowId => {
  return order.find((id) => windows.get(id)?.isModal);
});

export const getGlobalWindows = createSelector(getWindows, (windows): WindowType[] => {
  return windows.filter(({ isGlobal }) => isGlobal);
});

export const getWindowsWithOrder = createSelector(
  getWindows,
  getOrder,
  getTopmostModal,
  <K extends number | string = any>(
    windows: WindowType<K>[],
    order: WindowId[],
    topmostModal: WindowId,
  ): Array<WindowType<K, any> & { order: number; maskOrder?: number }> =>
    windows.map((data) => ({
      ...data,
      focusParent: data.isGlobal ? topmostModal : data.focusParent,
      order: order.findIndex((id) => data.id === id),
      maskOrder: order.findIndex((id) => `${data.id}/mask` === id),
    })),
);
