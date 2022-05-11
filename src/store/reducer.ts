import { uniq, without } from "lodash";
import { Reducer } from "react";
import { WindowId, WindowManagerState, WindowType } from "../types";
import { Action } from "./action";
import { combine } from "./combine";

export function withoutId<T extends { id: I }, I = string>(arr: T[], id: T["id"]): T[] {
  return arr.filter((el) => id !== el.id);
}

const windows: Reducer<WindowType<any, any>[], Action> = (windows = [], action) => {
  switch (action.type) {
    case "CLEAR_WINDOWS":
      return [];
    case "OPEN_WINDOW":
      return [...windows, action.windowData];
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
      return uniq([action.windowData.id, ...state]);
    case "CLOSE_WINDOW":
      return without(state, action.id);
    case "FOCUS_WINDOW":
      if (action.id !== state[0]) {
        return uniq([action.id, ...state]);
      }
    default:
      return state;
  }
};

export const reducer = combine<Reducer<WindowManagerState, Action>>({ windows, order });
