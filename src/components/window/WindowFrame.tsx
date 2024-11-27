import { css, cx } from "@emotion/css";
import { isEqual } from "lodash";
import { mapValues } from "lodash/fp";
import React, { PropsWithChildren, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import FocusLock from "react-focus-lock";
import { Position, Rnd } from "react-rnd";
import { useMutationObserver, usePreviousDifferent } from "rooks";
import { DRAG_HANDLE_CLASS_NAME, DRAG_PREVENT_CLASS_NAME } from "../../consts";
import { useViewportSize } from "../../hooks";
import { useScrollFix } from "../../hooks/useScrollFix";
import { useFrameTheme } from "../../themeHooks";
import { LayoutData } from "../../types";
import { random } from "../../utils";
import { SnapMask } from "./SnapMask";
import { Coords, Side, Size } from "./types";
import { Box, useSnapAreas } from "./useSnapAreas";
import { useSnapSide } from "./useSnapSide";
import { useTransition } from "../TransitionProvider";

interface WindowFrameProps {
  id: string;
  focusGroup?: string;
  zIndex?: number;
  randomizePosition?: number;
  onFocus?: () => void;
  moveable?: boolean;
  resizable?: boolean;
  maximized?: boolean;
  onEscape?: () => void;
  onEdgeSnap?: (e: { name: string; code: Side }) => void;
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

function calcCoord(start: number, end: number, size: number, viewportSize: number, padding: number) {
  return Math.max(padding, end >= viewportSize - padding / 2 ? viewportSize - size - padding : start);
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

export const WindowFrame = (props: PropsWithChildren<WindowFrameProps>): JSX.Element => {
  const { getTransitionStyle } = useTransition();
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
    layoutData = {},
    id,
  } = props;

  const { minWidth = props.minWidth ?? 400, minHeight = props.minHeight ?? 140 } = layoutData;
  const ref = useRef<HTMLDivElement>();
  const viewport = useViewportSize();
  const [position, setPosition] = useState<Coords>();
  const [size, setSize] = useState<Size>(() => {
    const { right, bottom, left, top, width, height } = layoutData;
    return {
      height: top >= 0 && bottom >= 0 ? viewport.height - top - bottom : height ?? props.height,
      width: left >= 0 && right >= 0 ? viewport.width - left - right : width ?? props.width,
    };
  });

  const { focusWrapperTheme, windowTheme, windowMargin } = useFrameTheme();
  const dragging = useRef(false);

  const [touched, _setTouched] = useState(false);
  const touch = useCallback(() => _setTouched(true), []);

  const forceCenterWindow = useCallback(
    (initialPosition: Coords) => {
      if (ref.current) {
        const randomize = mapValues<Coords, number>((v: number) => Math.max(0, v + random(randomizePosition)));
        const { height, width } = ref.current.getBoundingClientRect();
        const x = (viewport.width - width) / 2;
        const y = (viewport.height * 0.75 - height) / 2;
        const center = randomize({ x, y });

        setPosition(
          roundCoords({
            x: initialPosition.x ?? center.x,
            y: initialPosition.y ?? center.y,
          }),
        );
      }
    },
    [randomizePosition, viewport.height, viewport.width],
  );

  const onContentChanged = useCallback(() => {
    if (!touched) {
      const { height, width } = ref.current.getBoundingClientRect();
      const { right, bottom, left, top } = layoutData;
      forceCenterWindow({
        x: !(left >= 0) && right >= 0 ? viewport.width - right - width : left,
        y: !(top >= 0) && bottom >= 0 ? viewport.height - bottom - height : top,
      });
    }
  }, [forceCenterWindow, layoutData, touched, viewport.height, viewport.width]);

  const contentAvailable = useContentVisibility(ref, onContentChanged);

  const wasMaximized = usePreviousDifferent(maximized);

  // setup position correction for screen edges
  const calcEdgePosition = useCallback(
    (viewport, box: Box = ref.current.getBoundingClientRect()) => {
      const width = size?.width || box?.width || 0;
      const height = size?.height || box?.height || 0;
      return roundCoords({
        x: calcCoord(box.x, box.x + box.width, width, viewport.width, windowMargin),
        y: calcCoord(box.y, box.y + box.height, height, viewport.height, windowMargin),
      });
    },
    [size, windowMargin],
  );

  useLayoutEffect(() => {
    if (contentAvailable && position && !(maximized || wasMaximized)) {
      const newValue = calcEdgePosition(viewport);
      setPosition((current) => (isEqual(newValue, current) ? current : newValue));
    }
  }, [contentAvailable, wasMaximized, calcEdgePosition, maximized, position, viewport]);

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
    (e, { x, y }) => {
      if (!dragging.current) {
        return;
      }

      dragging.current = false;
      savePosition({ x, y });
      onSideSnap?.(side, true);
      onSnapCallback?.({ name: Side[side], code: side });
      setSide(Side.none);
    },
    [onSideSnap, onSnapCallback, savePosition, side],
  );

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
      <Rnd
        disableDragging={maximized || !moveable}
        enableResizing={resizable && !maximized}
        className={cx(windowClass, windowTheme, ...getTransitionStyle(id))}
        style={{ display: "flex", zIndex }} // override default inline-block
        bounds="#windowsViewport"
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
      <SnapMask previewBox={snapPreviewBox} />
    </>
  );
};
