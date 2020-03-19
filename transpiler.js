// import { Api, Lua51Target } from "dist/api.js";
var transpiler = require("./dist/api");
// import { Lua51Target } from "./src/target/lua51/Lua51Target";

new transpiler.Api(transpiler.Lua51Target, {
    entryPoint: "test2.ts",
    outputDir: "test_dist",
    outputRemoveSourceFolderName: "src",
    prettyPrint: true,
    emitTypes: true,
    emitComments: true,
    obscurify: false,
    transform: {
        tryStatement: (node, transpile, original) => {
            return "--[[ CUSTOM TRY ]] " + original(node);
        }
    }
}).transpile();