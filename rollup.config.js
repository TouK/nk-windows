import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import externals from "rollup-plugin-node-externals";
import svgr from "@svgr/rollup";
import typescript from "rollup-plugin-typescript2";

export default [
  {
    input: {
      index: "./src/index.ts",
      "components/window/defaultComponents": "./src/components/window/defaultComponents.ts",
      "debug/index": "./src/demo/DebugButtons.tsx",
    },
    output: [
      {
        dir: "./cjs",
        format: "cjs",
        sourcemap: true,
      },
      {
        dir: "./esm",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [externals(), resolve(), commonjs(), svgr(), typescript()],
  },
];
