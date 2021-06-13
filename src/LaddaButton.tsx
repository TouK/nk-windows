import { cx } from "emotion";
import "ladda/dist/ladda.min.css";
import React from "react";
import Button from "react-ladda";
import { useLaddaButtonTheme } from "./themeHooks";

export const LaddaButton = ({ className, ...props }): JSX.Element => {
  const laddaButtonTheme = useLaddaButtonTheme();
  return <Button {...props} className={cx(laddaButtonTheme, className)} />;
};
