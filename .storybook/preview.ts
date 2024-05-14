import type { Preview } from "@storybook/react";

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

const preview: Preview = {
  parameters
};

export default preview;

