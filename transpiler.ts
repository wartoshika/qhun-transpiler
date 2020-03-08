import { Api } from "./src/Api";
import { Lua51Target } from "./src/target/lua51/Lua51Target";

new Api(Lua51Target, {
    entryPoint: "src/test.ts",
    outputDir: "dist",
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
}).transpile().subscribe(result => {

    console.log("Result: ", result);
});