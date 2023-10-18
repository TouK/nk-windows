import type { Meta, StoryObj } from "@storybook/react";
import Demo from "./demo";

const meta = {
  title: "Demo",
  component: Demo,
} satisfies Meta<typeof Demo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Defult: Story = {};
