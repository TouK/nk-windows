import { WindowId, WindowType } from "../types";
import { reducer } from "./reducer";
import { ThunkAction } from "./reducerWithThunk";

export type Action =
  | { type: "CLEAR_WINDOWS" }
  | { type: "OPEN_WINDOW"; windowData: WindowType<any, any> }
  | { type: "CLOSE_WINDOW"; id: WindowId }
  | { type: "FOCUS_WINDOW"; id: WindowId };

export type WMAction<R = void> = ThunkAction<typeof reducer, R>;
