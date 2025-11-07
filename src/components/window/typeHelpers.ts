import React from "react";

type Prettify<T> = { [K in keyof T]: T[K] } extends infer O ? { [K in keyof O]: O[K] } : never;

type ComponentsMap<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends React.MemoExoticComponent<infer C>
    ? C extends React.ForwardRefExoticComponent<infer P>
      ? React.ForwardRefExoticComponent<Prettify<P>>
      : C extends React.ComponentType<infer P>
        ? React.ComponentType<Prettify<P>>
        : never
    : T[K] extends React.ForwardRefExoticComponent<infer P>
      ? React.ForwardRefExoticComponent<Prettify<P>>
      : T[K] extends React.ComponentType<infer P>
        ? React.ComponentType<Prettify<P>>
        : never;
};

type OnlyComponents<T extends Record<string, any>> = {
  [K in keyof T as T[K] extends React.ComponentType<any> | React.ForwardRefExoticComponent<any> | React.MemoExoticComponent<any>
    ? K
    : never]: T[K];
};

export type Components<T> = Prettify<Partial<ComponentsMap<OnlyComponents<T>>>>;
