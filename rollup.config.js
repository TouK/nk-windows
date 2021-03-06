import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import svgr from "@svgr/rollup";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
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
    plugins: [peerDepsExternal(), resolve(), commonjs(), svgr(), typescript()],
  },
];
