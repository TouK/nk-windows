import { Reducer, ReducerAction, ReducerState, useCallback, useEffect, useReducer, useRef } from "react";

type ThunkDispatch<R extends Reducer<unknown, unknown>> = <T, A extends ReducerAction<R> | ThunkAction<R, T>>(
  action: A,
) => A extends ThunkAction<R, infer T> ? T : void;

export type ThunkAction<R extends Reducer<unknown, unknown>, T = unknown> = (
  dispatch: ThunkDispatch<R>,
  getState: () => ReducerState<R>,
) => T;

function isThunkAction<R extends Reducer<unknown, unknown>, T>(action: ReducerAction<R> | ThunkAction<R, T>): action is ThunkAction<R, T> {
  return typeof action === "function";
}

export type ReducerWithThunk<R extends Reducer<unknown, unknown>> = [ReducerState<R>, ThunkDispatch<R>];

export function useReducerWithThunk<R extends Reducer<unknown, unknown>>(reducer: R, initialState: ReducerState<R>): ReducerWithThunk<R> {
  const _state = useRef<ReducerState<R>>();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    _state.current = state;
  }, [state]);

  const getState = useCallback(() => _state.current, []);
  const customDispatch = useCallback((action) => (isThunkAction(action) ? action(customDispatch, getState) : dispatch(action)), []);

  return [state, customDispatch as ThunkDispatch<R>];
}
