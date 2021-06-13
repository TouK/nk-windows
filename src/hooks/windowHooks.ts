import { useMemo, useState } from "react";

export function useWindowZoom({
  isMaximized,
  isResizable,
}: {
  isMaximized?: boolean;
  isResizable?: boolean;
}): [boolean, (value?: boolean) => void] {
  const [zoom, setZoom] = useState(isMaximized);
  const toggleZoom = useMemo(
    () => (isResizable ? (value: boolean = null) => setZoom((z) => (value !== null ? value : !z)) : null),
    [isMaximized, isResizable],
  );
  return [zoom, toggleZoom];
}
