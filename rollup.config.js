import resolve from "rollup-plugin-node-resolve";
const externalModules = Object.keys(require("./package.json").dependencies);
console.log(externalModules);

export default {
    input: "dist/index.js",
    output: {
        file: "dist/bin/qhun-transpiler.js",
        format: "cjs"
    },
    plugins: [resolve({
        customResolveOptions: {
            moduleDirectory: "node_modules"
        }
    })],
    external: [externalModules]
}