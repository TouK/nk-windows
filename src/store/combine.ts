import { Reducer } from "react";

type ReducersMap<S, A> = {
  readonly [K in keyof S]: Reducer<S[K], A>;
};

export function combine<S, A>(...reducers: ReadonlyArray<ReducersMap<S, A> | Reducer<S, A>>): Reducer<S, A> {
  return (prevState, action) => {
    return reducers.reduce((previousValue, current) => {
      const reducer = typeof current === "function" ? current : combineMap(current);
      return reducer(previousValue, action);
    }, prevState);
  };
}

function combineMap<S, A>(reducers: ReducersMap<S, A>): Reducer<S, A> {
  return (prevState, action) => {
    return Object.entries<Reducer<S[keyof S], A>>(reducers).reduce((previousValue, [key, reducer]) => {
      const prevStateElement = prevState?.[key];
      return {
        ...previousValue,
        [key]: reducer(prevStateElement, action),
      };
    }, prevState);
  };
}
