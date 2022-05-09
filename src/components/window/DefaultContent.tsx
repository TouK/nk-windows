import React, { PropsWithChildren, useMemo } from "react";
import { DragHandle } from "../DragHandle";
import * as defaultComponents from "./defaultComponents";
import { FooterButtonProps } from "./footer";
import { WindowContentGrid } from "./WindowContentGrid";
import { WindowContentProps } from "./WindowContentProps";

export interface ContentClasses {
  content?: string;
  footer?: string;
  footerButton?: string;
  header?: string;
  headerButtons?: string;
}

export interface DefaultContentProps<K extends number | string = any, M = unknown> extends WindowContentProps<K, M> {
  buttons?: FooterButtonProps[];
  title?: string;
  backgroundDrag?: boolean;
  classnames?: ContentClasses;
  components?: Partial<typeof defaultComponents>;
}

function Content(props: PropsWithChildren<DefaultContentProps>): JSX.Element {
  const {
    title,
    classnames = {},
    children,
    buttons = [{ title: "Cancel", action: () => close() }],
    close,
    zoom,
    data,
    isMaximized,
    components = {},
  } = props;

  const { Content, Header, Footer, ...passComponents } = useMemo(
    () => ({
      ...defaultComponents,
      ...components,
    }),
    [components],
  );

  return (
    <WindowContentGrid>
      <Header
        title={title || data.title}
        classnames={classnames}
        isStatic={isMaximized || data.isStatic}
        isMaximized={isMaximized}
        zoomDialog={zoom}
        closeDialog={close}
        components={passComponents}
      />
      <Content className={classnames.content}>{children}</Content>
      <Footer buttons={buttons} classnames={classnames} components={passComponents} />
    </WindowContentGrid>
  );
}

export function DefaultContent({ backgroundDrag, ...props }: PropsWithChildren<DefaultContentProps>): JSX.Element {
  return (
    <>
      {backgroundDrag ? (
        <DragHandle disabled={props.isMaximized || props.data.isStatic}>
          <Content {...props} />
        </DragHandle>
      ) : (
        <Content {...props} />
      )}
    </>
  );
}
