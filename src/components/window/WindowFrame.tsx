import { css, cx } from "@emotion/css";
import { isEqual } from "lodash";
import React, { PropsWithChildren, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import FocusLock from "react-focus-lock";
import { Position, Rnd } from "react-rnd";
import { CSSTransition } from "react-transition-group";
import { usePrevious } from "rooks";
import { DRAG_HANDLE_CLASS_NAME } from "../../consts";
import { useViewportSize } from "../../hooks";
import { useFrameTheme } from "../../themeHooks";
import { random } from "../../utils";

interface WindowFrameProps {
  focusGroup?: string;
  zIndex?: number;
  randomizePosition?: number;
  onFocus?: () => void;
  moveable?: boolean;
  resizable?: boolean;
  maximized?: boolean;
  onTopEdgeZoom?: (isTouching: boolean) => void;
  onEscape?: () => void;
}

const zoomAnimation = {
  enter: css({ transition: "all 150ms" }),
  exit: css({ transition: "all 150ms" }),
};

function calcCoord(padding: number, end: number, viewportSize: number, current: number) {
  return Math.max(padding, end >= viewportSize - padding / 2 ? current - Math.max(padding, end - viewportSize) : current);
}

export function WindowFrame(props: PropsWithChildren<WindowFrameProps>): JSX.Element {
  const {
    focusGroup,
    zIndex,
    randomizePosition,
    onFocus,
    onEscape,
    maximized = false,
    resizable = false,
    moveable = false,
    onTopEdgeZoom,
  } = props;
  const ref = useRef<HTMLDivElement>();
  const viewport = useViewportSize();
  const [position, setPosition] = useState<{ x: number; y: number }>();
  const [size, setSize] = useState<{ width: number; height: number }>(null);
  const { focusWrapperTheme, windowTheme, windowMargin } = useFrameTheme();
  const dragging = useRef(false);

  // set initial position
  useEffect(() => {
    const { height, width } = ref.current.getBoundingClientRect();
    if (dragging.current) return;
    if (!position) {
      setPosition({
        x: Math.max(0, (viewport.width - width) / 2 + random(randomizePosition)),
        y: Math.max(0, (viewport.height * 0.75 - height) / 2 + random(randomizePosition)),
      });
    }
  }, [maximized, position, randomizePosition, viewport]);

  // setup position correction for screen egdes
  const wasMaximized = usePrevious(maximized);
  const calcPosition = useCallback(
    (viewport) => {
      const { top, left, bottom, right } = ref.current.getBoundingClientRect();
      return {
        x: calcCoord(windowMargin, right, viewport.width, left),
        y: calcCoord(windowMargin, bottom, viewport.height, top),
      };
    },
    [windowMargin],
  );

  useLayoutEffect(() => {
    if (!(maximized || wasMaximized)) {
      const newValue = calcPosition(viewport);
      setPosition((current) => (isEqual(newValue, current) ? current : newValue));
    }
  }, [wasMaximized, calcPosition, maximized, position, viewport]);

  const savePosition = useCallback(
    (position: Position) => !(maximized || wasMaximized) && setPosition(position),
    [wasMaximized, maximized],
  );

  const timeout = useRef<NodeJS.Timeout>();
  const onDrag = useCallback(
    (e, { y }) => {
      dragging.current = true;

      clearTimeout(timeout.current);

      // maximize when top edge long touched
      if (onTopEdgeZoom) {
        if (maximized && y > 15) {
          timeout.current = setTimeout(() => {
            if (dragging.current) {
              setPosition((p) => ({ ...p, y }));
              onTopEdgeZoom(false);
            }
          }, 40);
        } else if (y <= 15) {
          timeout.current = setTimeout(() => {
            if (dragging.current) {
              onTopEdgeZoom(true);
            }
          }, 250);
        }
      }
    },
    [maximized, onTopEdgeZoom],
  );

  const onDragStop = useCallback(
    (e, position) => {
      savePosition(position);
      dragging.current = false;
    },
    [savePosition],
  );

  const onEnter = useCallback(() => {
    const { height, width } = ref.current.getBoundingClientRect();
    setSize({ width, height });
  }, []);

  const onExited = useCallback(() => {
    setSize(null);
  }, []);

  const onResizeStop = useCallback((e, dir, el, delta, position) => savePosition(position), [savePosition]);
  const [focused, setFocused] = useState(false);

  const focusWrapperClass = css({
    boxSizing: "border-box",
    overflow: "auto",
    width: "100%",
    height: "100%",
    display: "flex",
  });

  const windowClass = css({
    boxSizing: "border-box",
    overflow: "visible",
    backfaceVisibility: "hidden",
    perspective: "1000",
    willChange: "transform, top, left, minWidth, minHeight, width, height",
  });

  const focus = useCallback(() => {
    onFocus();
    setFocused(true);
  }, [onFocus]);
  const blur = useCallback(() => {
    setFocused(false);
  }, []);

  const maxSize = useMemo(
    () => ({
      width: `calc(100% - ${position?.x <= windowMargin ? windowMargin * 2 : position?.x || 0}px)`,
      height: `calc(100% - ${position?.y <= windowMargin ? windowMargin * 2 : position?.y || 0}px)`,
    }),
    [windowMargin, position],
  );

  return (
    <CSSTransition in={maximized} timeout={250} classNames={zoomAnimation} onEnter={onEnter} onExited={onExited}>
      <Rnd
        disableDragging={maximized || !moveable}
        enableResizing={resizable && !maximized}
        className={cx(windowClass, windowTheme)}
        style={{ display: "flex", zIndex }} // override default inline-block
        bounds="parent"
        size={size}
        position={maximized ? { x: 0, y: 0 } : position}
        minWidth={maximized ? "100%" : 400}
        minHeight={maximized ? "100%" : 140}
        maxHeight={maxSize.height}
        maxWidth={maxSize.width}
        onResizeStop={onResizeStop}
        onDrag={onDrag}
        onDragStop={onDragStop}
        dragHandleClassName={DRAG_HANDLE_CLASS_NAME}
        data-testid="window-frame"
      >
        {/* trap keyboard focus within group (windows opened since last modal) */}
        <FocusLock className={css({ flex: 1 })} group={focusGroup} disabled={!focusGroup} returnFocus autoFocus>
          <div
            ref={ref}
            onFocus={focus}
            onBlur={blur}
            onKeyDown={(event) => event.key === "Escape" && onEscape?.()}
            tabIndex={-1}
            className={cx(focusWrapperClass, focusWrapperTheme)}
            data-testid="window"
          >
            {props.children}
          </div>
        </FocusLock>
      </Rnd>
    </CSSTransition>
  );
}
