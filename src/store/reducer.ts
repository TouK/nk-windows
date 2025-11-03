import { uniq, without } from "lodash";
import { Reducer } from "react";
import { WindowId, WindowManagerState, WindowType } from "../types";
import { Action } from "./action";
import { combine } from "./combine";

export function withoutId<T extends { id: I }, I = string>(arr: T[], id: T["id"]): T[] {
  return arr.filter((el) => id !== el.id);
}

const windows: Reducer<WindowType[], Action> = (windows = [], action) => {
  switch (action.type) {
    case "CLEAR_WINDOWS":
      return [];
    case "OPEN_WINDOW":
      const existingWindow = windows.find((w) => w.id === action.windowData.id);
      if (existingWindow) {
        return windows.map((window) => (window === existingWindow ? action.windowData : window));
      }
      return [...windows, action.windowData];
    case "FOCUS_WINDOW":
      return windows.map((w) => (w.isGlobal ? { ...w, focusParent: action.topmostModal } : w));
    case "CLOSE_WINDOW":
      return withoutId(windows, action.id);
    default:
      return windows;
  }
};

const order: Reducer<WindowId[], Action> = (state = [], action) => {
  switch (action.type) {
    case "CLEAR_WINDOWS":
      return [];
    case "OPEN_WINDOW":
      return state[0] === action.windowData.id ? state : uniq([action.windowData.id, ...state]);
    case "FOCUS_WINDOW":
      return state[0] === action.id ? state : uniq([action.id, ...state]);
    case "CLOSE_WINDOW":
      return without(state, action.id);
    default:
      return state;
  }
};

export const reducer: Reducer<WindowManagerState, Action> = combine({ windows, order });
