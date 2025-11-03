import React, { forwardRef, useCallback } from "react";
import { useWindowManager, useWindowZoom } from "../../hooks";
import { WindowWithOrder } from "../../types";
import { ContentGetter, WindowContent } from "./WindowContent";
import { WindowFrame } from "./WindowFrame";

export interface WindowProps {
  data: WindowWithOrder;
  contentGetter: ContentGetter;
}

export const Window = forwardRef<HTMLDivElement, WindowProps>(({ data, contentGetter }, ref) => {
  const { isResizable, isStatic, focusParent, id, order, shouldCloseOnEsc } = data;

  const { focus: onFocus, close: onClose, frontWindow } = useWindowManager(id);
  const [zoom, onToggleZoom] = useWindowZoom(data);

  const onEscKey = useCallback(() => {
    if (shouldCloseOnEsc && frontWindow === id) {
      return onClose();
    }
  }, [frontWindow, id, onClose, shouldCloseOnEsc]);

  return (
    <WindowFrame
      zIndex={order}
      focusGroup={focusParent}
      onFocus={onFocus}
      maximized={zoom}
      resizable={isResizable}
      moveable={!isStatic}
      randomizePosition={data.isModal ? 0 : 100}
      onEscape={onEscKey}
      width={data.width}
      height={data.height}
      minWidth={data.minWidth}
      minHeight={data.minHeight}
      ref={ref}
      layoutData={{
        width: data.width,
        height: data.height,
        minWidth: data.minWidth,
        minHeight: data.minHeight,
        ...data.layoutData,
      }}
    >
      <WindowContent contentGetter={contentGetter} data={data} close={onClose} zoom={onToggleZoom} isMaximized={zoom} />
    </WindowFrame>
  );
});

Window.displayName = "Window";
