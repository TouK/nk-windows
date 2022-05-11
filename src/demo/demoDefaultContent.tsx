import React, { PropsWithChildren } from "react";
import { DemoWindowKind } from "./DemoWindowKind";
import { getWindowDemoColors } from "./getWindowDefaultColors";
import { DefaultContent, DefaultContentProps } from "../index";

export const DemoDefaultContent = (props: PropsWithChildren<DefaultContentProps<DemoWindowKind>>) => (
  <DefaultContent classnames={{ header: getWindowDemoColors(props.data.kind) }} {...props} />
);
