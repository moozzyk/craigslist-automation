const { build } = require("esbuild");
const { dependencies, peerDependencies } = require("./package.json");

const base = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  external: Object.keys(dependencies).concat(
    Object.keys(peerDependencies ?? {})
  ),
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
