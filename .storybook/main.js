module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
  ],
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },

  webpackFinal: async (config, { configType }) => {
    const assetRule = config.module.rules.find(({ test }) => test.test(".svg"));

    assetRule.test = new RegExp(assetRule.test.source.replace("svg|", ""), assetRule.test.source.flags)

    config.module.rules.unshift({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};
