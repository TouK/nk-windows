import { defaultsDeep } from "lodash";
import UAParser from "ua-parser-js";

Cypress.Commands.overwrite("visit", (original: Cypress.Chainable["visit"], first, second) => {
  const { name: os } = new UAParser().getOS();
  const pixelRatio = window.devicePixelRatio;
  const osDir = pixelRatio !== 1 ? `${os}/x${pixelRatio}` : os;
  Cypress.env(
    defaultsDeep(
      {
        pluginVisualRegressionImagesPath: `{spec_path}/__image_snapshots__/${Cypress.browser.name}/${osDir}`,
      },
      Cypress.env(),
    ),
  );
  return original(typeof first === "string" ? { ...second, url: first } : { ...first });
});
