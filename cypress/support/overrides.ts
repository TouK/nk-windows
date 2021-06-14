import { defaultsDeep } from "lodash";
import UAParser from "ua-parser-js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable<Subject = any> {
      // fixed wrong original
      toMatchImageSnapshot(
        options?: Partial<{
          name: string;
          imageConfig: Partial<{
            createDiffImage: boolean;
            threshold: number;
            thresholdType: "percent" | "pixel";
          }>;
          screenshotConfig: Partial<ScreenshotDefaultsOptions>;
        }>,
      ): Chainable<null>;
    }
  }
}

Cypress.Commands.overwrite(
  "visit",
  (original: Cypress.Chainable["visit"], first, second) => {
    const { name: os } = new UAParser().getOS();
    const pixelRatio = window.devicePixelRatio;
    Cypress.env(
      defaultsDeep(
        {
          "cypress-plugin-snapshots": {
            separator:
              pixelRatio !== 1 ? ` [${os} x${pixelRatio}] #` : ` [${os}] #`,
          },
        },
        Cypress.env(),
      ),
    );
    return original(first, second);
  },
);
