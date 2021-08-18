import React, { useCallback } from "react";
import { useWindowManager, useWindowZoom } from "../../hooks";
import { WindowWithOrder } from "../../types";
import { ContentGetter, WindowContent } from "./WindowContent";
import { WindowFrame } from "./WindowFrame";

export interface WindowProps {
  data: WindowWithOrder;
  contentGetter: ContentGetter;
}

export function Window({ data, contentGetter }: WindowProps): JSX.Element {
  const { isResizable, isStatic, focusParent, id, order, shouldCloseOnEsc } = data;

  const { focus: onFocus, close: onClose } = useWindowManager(id);
  const [zoom, onToggleZoom] = useWindowZoom(data);

  const onEscKey = useCallback(() => shouldCloseOnEsc && onClose(), [onClose, shouldCloseOnEsc]);

  return (
    <WindowFrame
      zIndex={order}
      focusGroup={focusParent}
      onFocus={onFocus}
      maximized={zoom}
      resizable={isResizable}
      moveable={!isStatic}
      randomizePosition={data.isModal ? 0 : 100}
      onTopEdgeZoom={onToggleZoom}
      onEscape={onEscKey}
    >
      <WindowContent contentGetter={contentGetter} data={data} close={onClose} zoom={onToggleZoom} isMaximized={zoom} />
    </WindowFrame>
  );
}
