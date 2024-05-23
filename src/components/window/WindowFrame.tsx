import { css, cx } from "@emotion/css";
import { isEqual } from "lodash";
import { mapValues } from "lodash/fp";
import React, { PropsWithChildren, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import FocusLock from "react-focus-lock";
import { Position, Rnd } from "react-rnd";
import { CSSTransition } from "react-transition-group";
import { useMutationObserver, usePreviousImmediate } from "rooks";
import { DRAG_HANDLE_CLASS_NAME, DRAG_PREVENT_CLASS_NAME } from "../../consts";
import { useViewportSize } from "../../hooks";
import { useFrameTheme } from "../../themeHooks";
import { random } from "../../utils";
import { useScrollFix } from "../../hooks/useScrollFix";
import { fadeInAnimation } from "../WindowsContainer";
import { SnapMask } from "./SnapMask";
import { Box, useSnapAreas } from "./useSnapAreas";
import { useSnapSide } from "./useSnapSide";

export enum Side {
  none,
  top = 1 << 0,
  right = 1 << 1,
  bottom = 1 << 2,
  left = 1 << 3,
  topLeft = top | left,
  topRight = top | right,
  bottomLeft = bottom | left,
  bottomRight = bottom | right,
}

interface WindowFrameProps {
  focusGroup?: string;
  zIndex?: number;
  randomizePosition?: number;
  onFocus?: () => void;
  moveable?: boolean;
  resizable?: boolean;
  maximized?: boolean;
  onEscape?: () => void;
  onEdgeSnap?: (e: { name: string; code: Side }) => void;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
}

const zoomAnimation = {
  enter: css({ transition: "all 150ms" }),
  exit: css({ transition: "all 150ms" }),
};

function calcCoord(start: number, end: number, size: number, viewportSize: number, padding: number) {
  return Math.max(padding, end >= viewportSize - padding / 2 ? viewportSize - size - padding : start);
}

export interface Coords {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

const roundCoords = mapValues<Coords, number>(Math.round);

function useContentVisibility(ref: React.MutableRefObject<HTMLElement>, onContentChange?: (children: Element) => void) {
  const [firstChild, setFirstChild] = useState<Element>();
  if (firstChild !== ref.current?.children[0]) {
    setFirstChild(ref.current?.children[0]);
  }

  // support lazy loaded content with different size fallback
  useMutationObserver(ref, () => setFirstChild(ref.current?.children[0]));

  useLayoutEffect(() => firstChild && onContentChange?.(firstChild), [onContentChange, firstChild]);

  return !!firstChild;
}

const focusWrapperClass = css({
  boxSizing: "border-box",
  overflow: "auto",
  width: "100%",
  height: "100%",
  display: "flex",
  outline: "none",
});

const windowClass = css({
  boxSizing: "border-box",
  overflow: "visible",
  backfaceVisibility: "hidden",
  perspective: "1000",
  willChange: "transform, top, left, minWidth, minHeight, width, height",
});

export function WindowFrame(props: PropsWithChildren<WindowFrameProps>): JSX.Element {
  const {
    focusGroup,
    zIndex,
    randomizePosition,
    onFocus,
    onEscape,
    onEdgeSnap: onSnapCallback,
    maximized = false,
    resizable = false,
    moveable = false,
    height,
    width,
    minWidth = 400,
    minHeight = 140,
  } = props;
  const ref = useRef<HTMLDivElement>();
  const viewport = useViewportSize();
  const [position, setPosition] = useState<Coords>();
  const [size, setSize] = useState<Size>(() => ({ height, width }));
  const prevSize = usePreviousImmediate(size);

  const { focusWrapperTheme, windowTheme, windowMargin } = useFrameTheme();
  const dragging = useRef(false);

  const [touched, _setTouched] = useState(false);
  const touch = useCallback(() => _setTouched(true), []);

  const forceCenterWindow = useCallback(() => {
    if (ref.current) {
      const randomize = mapValues<Coords, number>((v: number) => Math.max(0, v + random(randomizePosition)));
      const { height, width } = ref.current.getBoundingClientRect();
      const x = (viewport.width - width) / 2 + windowMargin;
      const y = (viewport.height - height) / 2 + windowMargin;
      setPosition(roundCoords(randomize({ x, y })));
    }
  }, [randomizePosition, viewport.height, viewport.width, windowMargin]);

  const onContentChanged = useCallback(() => {
    if (!touched) {
      forceCenterWindow();
    }
  }, [forceCenterWindow, touched]);

  const contentAvailable = useContentVisibility(ref, onContentChanged);

  // set initial position
  useEffect(() => {
    if (dragging.current) return;
    if (contentAvailable && !position) {
      forceCenterWindow();
    }
  }, [contentAvailable, maximized, position, forceCenterWindow]);

  const wasMaximized = usePreviousImmediate(maximized);

  // setup position correction for screen egdes
  const calcEdgePosition = useCallback(
    (viewport, box: Box = ref.current.getBoundingClientRect()) => {
      const width = size?.width || box?.width || 0;
      const height = size?.height || box?.height || 0;
      return roundCoords({
        x: calcCoord(box.x, box.x + box.width, width, viewport.width, windowMargin),
        y: calcCoord(box.y, box.y + box.height, height, viewport.height, windowMargin),
      });
    },
    [ref, size?.height, size?.width, windowMargin],
  );

  useLayoutEffect(() => {
    if (contentAvailable && !(maximized || wasMaximized)) {
      const newValue = calcEdgePosition(viewport);
      setPosition((current) => (isEqual(newValue, current) ? current : newValue));
    }
  }, [calcEdgePosition, contentAvailable, maximized, viewport, wasMaximized]);

  const savePosition = useCallback((position: Position) => !maximized && setPosition(roundCoords(position)), [maximized]);

  const [side, setSide] = useState<Side>(Side.none);
  const getSnapSide = useSnapSide(ref);

  const setFrameBox = useCallback((box: Box) => {
    const { y, height, width, x } = box;
    setSize({ width, height });
    setPosition({ x, y });
  }, []);

  const [snapPreviewBox, onSideSnap] = useSnapAreas(windowMargin, setFrameBox);

  useEffect(() => {
    onSideSnap?.(side, !dragging.current);
  }, [onSideSnap, side]);

  const timeout = useRef<NodeJS.Timeout>();
  const onDrag = useCallback(() => {
    dragging.current = true;

    clearTimeout(timeout.current);

    if (!resizable) {
      return;
    }

    const side = getSnapSide(1);

    if (side) {
      timeout.current = setTimeout(() => {
        if (dragging.current && !maximized) {
          setSide(side);
        }
      }, 100);
    } else {
      setSide(side);
    }
  }, [getSnapSide, maximized, resizable]);

  const onDragStop = useCallback(
    (e, position) => {
      dragging.current = false;
      savePosition(position);
      onSideSnap?.(side, true);
      onSnapCallback?.({ name: Side[side], code: side });
      setSide(Side.none);
    },
    [onSideSnap, onSnapCallback, savePosition, side],
  );

  const onEnter = useCallback(() => {
    const { height, width } = ref.current.getBoundingClientRect();
    setSize({ width, height });
  }, []);

  const onExited = useCallback(() => {
    setSize(prevSize || null);
  }, [prevSize]);

  const onResizeStop = useCallback(
    (e, dir, el, delta, position) => {
      const { width, height } = el.getBoundingClientRect();
      setFrameBox({ ...position, width, height });
    },
    [setFrameBox],
  );

  const [focused, setFocused] = useState(false);
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
      height: viewport.height - (position?.y <= windowMargin ? windowMargin * 2 : position?.y || 0),
    }),
    [windowMargin, position, viewport.height],
  );

  const normalizeMinSize = useCallback(
    (size: number, viewportSize: number) => {
      if (!contentAvailable) {
        return 0;
      }
      if (maximized) {
        return viewportSize;
      }
      const maxSize = viewportSize - windowMargin * 2;
      if (size >= maxSize) {
        return maxSize;
      }
      return size;
    },
    [contentAvailable, maximized, windowMargin],
  );

  const currentMinWidth = useMemo(() => normalizeMinSize(minWidth, viewport.width), [normalizeMinSize, viewport.width, minWidth]);

  const currentMinHeight = useMemo(() => normalizeMinSize(minHeight, viewport.height), [normalizeMinSize, viewport.height, minHeight]);

  useScrollFix(ref.current);

  return (
    <>
      {/*fallback animation for lazy loaded content*/}
      <CSSTransition nodeRef={ref} in={contentAvailable} timeout={250} classNames={fadeInAnimation}>
        <CSSTransition in={maximized} timeout={250} classNames={zoomAnimation} onEnter={onEnter} onExited={onExited}>
          <Rnd
            disableDragging={maximized || !moveable}
            enableResizing={resizable && !maximized}
            className={cx(windowClass, windowTheme)}
            style={{ display: "flex", zIndex }} // override default inline-block
            bounds="parent"
            size={size}
            position={maximized ? { x: 0, y: 0 } : position}
            minWidth={currentMinWidth}
            minHeight={currentMinHeight}
            maxHeight={maxSize.height}
            maxWidth={maxSize.width}
            onResizeStop={onResizeStop}
            onDrag={onDrag}
            onMouseDown={touch}
            onDragStart={touch}
            onResizeStart={touch}
            onDragStop={onDragStop}
            dragHandleClassName={DRAG_HANDLE_CLASS_NAME}
            cancel={`a[href], textarea, input, select, button, ${DRAG_PREVENT_CLASS_NAME}`}
            data-testid="window-frame"
          >
            {/* trap keyboard focus within group (windows opened since last modal) */}
            <FocusLock className={css({ flex: 1 })} group={focusGroup} disabled={!focusGroup} returnFocus autoFocus>
              <div
                ref={ref}
                onFocus={focus}
                onBlur={blur}
                onKeyDown={(event) => {
                  event.key === "Escape" && onEscape?.();
                  touch();
                }}
                tabIndex={-1}
                className={cx(focusWrapperClass, focusWrapperTheme)}
                data-testid="window"
              >
                {props.children}
              </div>
            </FocusLock>
          </Rnd>
        </CSSTransition>
      </CSSTransition>
      <SnapMask previewBox={snapPreviewBox} />
    </>
  );
}
