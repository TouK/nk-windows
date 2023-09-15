import { useEffect, useState } from "react";

export function useVisualHeight() {
  const [visualHeight, setVisualHeight] = useState(window.visualViewport?.height || window.innerHeight);
  useEffect(() => {
    const listener = () => {
      setVisualHeight(window.visualViewport?.height);
    };
    window.visualViewport?.addEventListener("resize", listener);
    return () => {
      window.visualViewport?.removeEventListener("resize", listener);
    };
  }, []);
  return visualHeight;
}
