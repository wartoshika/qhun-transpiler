var Transpiler = require("@wartoshika/qhun-transpiler");

new Transpiler.Api("lua", {
    entrypoint: "./src/index.ts"
}).transpile().subscribe(pipeline => {

    pipeline.persistAllFiles()
        .prettyPrintResult()
        .applyPostProjectTranspile();

});
