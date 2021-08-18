import React, { PropsWithChildren, useMemo } from "react";
import { defaultComponents } from "./DefaultComponents";
import { DragHandle } from "./DragHandle";
import { WindowButtonProps } from "./FooterButton";
import { getWindowDefaultColors } from "./getWindowDefaultColors";
import { WindowContentProps } from "./WindowContentProps";
import { WindowContentGrid } from "./WindowContentWrap";

interface ContentClasses {
  content?: string;
  footer?: string;
  header?: string;
}

export interface DefaultContentProps<K extends number | string = any, M = unknown> extends WindowContentProps<K, M> {
  buttons?: WindowButtonProps[];
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

  const classes: ContentClasses = useMemo(
    () => ({
      header: getWindowDefaultColors(data.kind),
      ...classnames,
    }),
    [classnames, data.kind],
  );

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
        className={classes.header}
        isStatic={isMaximized || data.isStatic}
        isMaximized={isMaximized}
        zoomDialog={zoom}
        closeDialog={close}
        components={passComponents}
      />
      <Content className={classes.content}>{children}</Content>
      <Footer buttons={buttons} className={classes.footer} components={passComponents} />
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
