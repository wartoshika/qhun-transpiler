import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-node-resolve";
const externalModules = Object.keys(require("./package.json").dependencies);
console.log(externalModules);

export default {
    input: "dist/index.js",
    output: {
        file: "dist/bin/qhun-transpiler.js",
        format: "cjs"
    },
    plugins: [resolve({
        main: true,
        customResolveOptions: {
            moduleDirectory: "node_modules"
        }
    }), commonjs({
        include: 'node_modules/**'
    })],
    external: [externalModules]
}