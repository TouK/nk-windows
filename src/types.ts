export type LayoutData = {
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
};

export interface WindowType<Kind extends string | number = any, Meta = any> {
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
  /**
   * @deprecated use layoutData
   */
  width?: number;
  /**
   * @deprecated use layoutData
   */
  height?: number;
  /**
   * @deprecated use layoutData
   */
  minWidth?: number;
  /**
   * @deprecated use layoutData
   */
  minHeight?: number;
  layoutData?: LayoutData;
}

export type WindowId = WindowType["id"];

export interface WindowWithOrder<K extends number | string = any> extends WindowType<K, any> {
  order: number;
}

export interface WindowManagerState<K extends number | string = any> {
  windows: WindowType<K, any>[];
  order: WindowId[];
}
