import { Reducer, ReducerAction, ReducerState } from "react";

type ReducersMap<R extends Reducer<any, any>, S = ReducerState<R>, A = ReducerAction<R>> = {
  [K in keyof S]: Reducer<S[K], A>;
};

export function combine<R extends Reducer<any, any>>(reducers: ReducersMap<R>): R {
  return ((prevState, action) =>
    Object.keys(reducers).reduce(
      (previousValue, key) => ({
        ...previousValue,
        [key]: reducers[key](prevState?.[key], action),
      }),
      {},
    )) as R;
}
