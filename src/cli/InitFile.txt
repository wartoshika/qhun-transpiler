import { QhunTranspilerApi } from "@wartoshika/qhun-transpiler";

new QhunTranspilerApi("lua", {
    entrypoint: "./src/index.ts"
}).transpile().subscribe(pipeline => {

    pipeline.persistAllFiles().prettyPrintResult();

});
