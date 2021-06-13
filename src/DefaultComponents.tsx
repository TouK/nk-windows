import { defaultHeaderComponents } from "./DefaultHeaderComponents";
import { WindowFooter } from "./WindowFooter";
import { WindowHeader } from "./WindowHeader";
import { WithOverflow } from "./WithOverflow";

export const defaultComponents = {
  Header: WindowHeader,
  ...defaultHeaderComponents,
  Content: WithOverflow,
  Footer: WindowFooter,
};
