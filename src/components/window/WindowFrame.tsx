import { css, cx } from "emotion";
import { isEqual } from "lodash";
import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import FocusLock from "react-focus-lock";
import { Position, Rnd } from "react-rnd";
import { CSSTransition } from "react-transition-group";
import { DRAG_HANDLE_CLASS_NAME } from "../../consts";
import { useViewportSize } from "../../hooks";
import { useFrameTheme } from "../../themeHooks";
import { defer, random } from "../../utils";

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

function calcOffView(viewportSize: number, end: number, current: number) {
  const normalizedEnd = Math.min(0, Math.round(viewportSize - end));
  const start = Math.round(current);

  return normalizedEnd ? (start === 0 ? current : current + normalizedEnd) : start > 0 ? current : 0;
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
  const dragging = useRef(false);

  useEffect(
    () =>
      defer(() => {
        const { height, width, bottom, right } = ref.current.getBoundingClientRect();
        if (dragging.current) return;
        if (!position) {
          setPosition({
            x: (viewport.width - width) / 2 + random(randomizePosition),
            y: (viewport.height * 0.75 - height) / 2 + random(randomizePosition),
          });
        }
        if (!maximized) {
          setPosition((current) => {
            const nextPosition = {
              x: calcOffView(viewport.width, right, current.x),
              y: calcOffView(viewport.height, bottom, current.y),
            };
            return isEqual(nextPosition, current) ? current : nextPosition;
          });
        }
      }),
    [maximized, position, randomizePosition, viewport],
  );

  const savePosition = useCallback((position: Position) => !maximized && setPosition(position), [maximized]);

  const timeout = useRef<NodeJS.Timeout>();
  const onDrag = useCallback(
    (e, { y }) => {
      dragging.current = true;

      if (!onTopEdgeZoom) {
        return;
      }

      clearTimeout(timeout.current);
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
  const { focusWrapperTheme, windowTheme } = useFrameTheme();
  const [focused, setFocused] = useState(false);

  const focusWrapperClass = css({
    overflow: "auto",
    width: "100%",
    height: "100%",
    display: "flex",
  });

  const windowClass = css({
    backdropFilter: "blur(16px)",
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

  return (
    <CSSTransition in={maximized} timeout={250} classNames={zoomAnimation} onEnter={onEnter} onExited={onExited}>
      <Rnd
        disableDragging={maximized || !moveable}
        enableResizing={resizable && !maximized}
        className={cx(windowClass, windowTheme, css({ zIndex }))}
        style={{ display: "flex" }} // override default inline-block
        bounds="parent"
        size={size}
        position={maximized ? { x: 0, y: 0 } : position}
        minWidth={maximized ? "100%" : 400}
        minHeight={maximized ? "100%" : 140}
        onResizeStop={onResizeStop}
        onDrag={onDrag}
        onDragStop={onDragStop}
        dragHandleClassName={DRAG_HANDLE_CLASS_NAME}
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
