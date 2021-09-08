import { createContext } from "react";

export interface ViewportContextType {
  width: number;
  height: number;
}

export const ViewportContext = createContext<ViewportContextType>({ width: 0, height: 0 });
