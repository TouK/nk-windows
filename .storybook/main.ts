import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-coverage",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    "@storybook/addon-webpack5-compiler-babel"
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true)
    }
  },
  webpackFinal: async (config) => {
    config.module.rules.forEach((rule) => {
      if (rule && rule instanceof Object && rule.test instanceof RegExp) {
        if (rule.test.test(".svg")) {
          rule.test = new RegExp(rule.test.source.replace("svg|", ""));
        }
      }
    });

    config.module.rules.unshift({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
  docs: {}
};
export default config;
