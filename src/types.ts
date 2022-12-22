import { Size } from "./components/window/WindowFrame";
import { CamelCasedProperties } from "type-fest";

export interface WindowType<Kind extends string | number = any, Meta = any> extends WithPrefixedProperties<Partial<Size>, "min"> {
  id: string;
  title?: string;
  isModal?: boolean; // blocks access to everything under
  isResizable?: boolean;
  isStatic?: boolean;
  isMaximized?: boolean;
  shouldCloseOnEsc?: boolean;
  parent?: WindowId; // closing parent closes children
  focusParent?: string; // modal is focusParent for self and for windows opened since this modal is visible
  kind?: Kind;
  meta?: Meta;
}

export type WindowId = WindowType["id"];

export interface WindowWithOrder<K extends number | string = any> extends WindowType<K, any> {
  order: number;
}

export interface WindowManagerState<K extends number | string = any> {
  windows: WindowType<K, any>[];
  order: WindowId[];
}

type WithPrefix<T, P extends string> = {
  [K in keyof T as K extends string ? `${P}-${K}` : never]: T[K];
};

export type WithPrefixedProperties<T, P extends string> = CamelCasedProperties<T & WithPrefix<T, P>>;
