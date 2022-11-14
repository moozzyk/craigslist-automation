const { build } = require("esbuild");
const { dependencies, peerDependencies } = require("./package.json");

const { Generator } = require("npm-dts");

new Generator({
  output: "dist/index.d.ts",
}).generate();

const base = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  external: Object.keys(dependencies).concat(
    Object.keys(peerDependencies ?? {})
  ),
  platform: "node",
};

build({
  ...base,
  outfile: "dist/index.js",
});

build({
  ...base,
  outfile: "dist/index.esm.js",
  format: "esm",
});
