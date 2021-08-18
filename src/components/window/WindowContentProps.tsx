import { WindowType } from "../../types";

export interface WindowContentProps<K extends number | string = any, M = undefined> {
  data: WindowType<K, M>;
  close?: () => void;
  zoom?: (value?: boolean) => void;
  isMaximized?: boolean;
}
