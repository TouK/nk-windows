import { MutableRefObject, useCallback, useMemo } from "react";
import useDimensions, { Options } from "react-cool-dimensions";

(async () => {
  if (!("ResizeObserver" in window)) {
    const { ResizeObserver, ResizeObserverEntry } = await import("@juggle/resize-observer");
    self.ResizeObserver = ResizeObserver;
    self.ResizeObserverEntry = ResizeObserverEntry as any; // Only use it when you have this trouble: https://github.com/wellyshen/react-cool-dimensions/issues/45
  }
})();

export const useSize: typeof useDimensions = (options) => {
  return useDimensions(options);
};

export function useSizeWithRef<T extends HTMLElement | null = HTMLElement>(
  ref: MutableRefObject<T>,
  options?: Options<T>,
): ReturnType<typeof useSize> {
  const dimensions = useSize<T>(options);
  const { observe } = dimensions;
  const observeWithRef = useCallback(
    (el: T) => {
      observe(el);
      ref.current = el;
    },
    [observe, ref],
  );
  return useMemo(() => ({ ...dimensions, observe: observeWithRef }), [dimensions, observeWithRef]);
}
