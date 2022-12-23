import React, { memo } from "react";
import { WindowContentProps } from "./WindowContentProps";

export type ContentGetter<K extends number | string = any> = React.FC<WindowContentProps<K, unknown>>;

export const WindowContent = memo(function WindowContent<K extends number | string = any>({
  contentGetter,
  ...props
}: WindowContentProps<K, unknown> & { contentGetter: ContentGetter }): JSX.Element {
  const Component = contentGetter;
  return <Component {...props} />;
});
