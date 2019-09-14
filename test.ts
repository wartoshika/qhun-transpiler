import { Api } from "./src/api/Api";
import { SyntaxKind } from "typescript";

new Api("lua", {
    entrypoint: "./src/index.ts"
}).transpile().subscribe(pipeline => {

    pipeline.persistAllFiles().prettyPrintResult().applyPostProjectTranspile();

});
