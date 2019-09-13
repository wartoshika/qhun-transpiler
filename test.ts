import { QhunTranspilerApi } from "./src/QhunTranspilerApi";
import { SyntaxKind } from "typescript";

new QhunTranspilerApi("lua", {
    configuration: {
        project: "package.json",
        targetConfig: {}
    },
    overwrite: {
        [SyntaxKind.BreakKeyword]: (node, transpile, original) => {

            return "break";
        }
    }
}).transpile();
