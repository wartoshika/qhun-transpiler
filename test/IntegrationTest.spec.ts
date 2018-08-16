import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";

import * as mockfs from "mock-fs";
import { JsonConfig } from "../src/config/json/JsonConfig";
import * as fs from "fs";
import { CommandLine } from "../src/CommandLine";

@suite("[Integration] Complete transpile test", slow(500), timeout(3000)) class IntegrationTest {

    public after() {
        mockfs.restore();
    }

    @test "Transpile using JsonReader"() {

        const transpileConfig: Partial<JsonConfig> = {
            tsconfig: "./iTsconfig.json",
            target: "lua",
            stripOutDir: "src"
        };
        const tsconfig = {
            "compilerOptions": {
                "module": "commonjs",
                "noImplicitAny": true,
                "removeComments": true,
                "preserveConstEnums": true,
                "experimentalDecorators": true,
                "emitDecoratorMetadata": true,
                "outDir": "dist",
                "moduleResolution": "node",
                "target": "es5",
                "sourceMap": true
            },
            "include": [
                "./src/**/*.ts"
            ]
        };

        // declare files
        const indexTs = `
            import {A} from "./a";
            import {b} from "./b";
            import {test} from "./c";
            console.log(b(a.TEST, test));
        `;
        const aTs = `export enum A { TEST, TEST2 }`;
        const bTs = `export const b = function(a,b) { return a + b; }`;
        const cTs = `export const test: string = "test";`;

        // create filesystem
        mockfs({
            "iTranspileConfig.json": JSON.stringify(transpileConfig),
            "iTsconfig.json": JSON.stringify(tsconfig),
            "src": {
                "index.ts": indexTs,
                "a.ts": aTs,
                "b.ts": bTs,
                "c.ts": cTs
            },
            "node_modules": {
                "command-line-args": {
                    "lib": {
                        "argv-parser.js": fs.readFileSync("node_modules/command-line-args/lib/argv-parser.js"),
                        "option.js": fs.readFileSync("node_modules/command-line-args/lib/option.js"),
                        "option-definition.js": fs.readFileSync("node_modules/command-line-args/lib/option-definition.js"),
                        "option-definitions.js": fs.readFileSync("node_modules/command-line-args/lib/option-definitions.js"),
                        "option-flag.js": fs.readFileSync("node_modules/command-line-args/lib/option-flag.js"),
                        "output.js": fs.readFileSync("node_modules/command-line-args/lib/output.js"),
                        "output-grouped.js": fs.readFileSync("node_modules/command-line-args/lib/output-grouped.js")
                    }
                },
                "array-back": {
                    "index.js": fs.readFileSync("node_modules/array-back/index.js")
                },
                "argv-tools": {
                    "index.js": fs.readFileSync("node_modules/argv-tools/index.js")
                },
                "typical": {
                    "lib": {
                        "typical.js": fs.readFileSync("node_modules/typical/lib/typical.js")
                    }
                },
                "lodash.camelcase": {
                    "index.js": fs.readFileSync("node_modules/lodash.camelcase/index.js")
                }
            }
        });

        // run the program
        const cli = new CommandLine([
            "-p", "iTranspileConfig.json"
        ]);

        cli.execute();

        // dist files must exists
        expect(fs.existsSync("dist/index.lua")).to.be.true;
        expect(fs.existsSync("dist/a.lua")).to.be.true;
        expect(fs.existsSync("dist/b.lua")).to.be.true;
        expect(fs.existsSync("dist/c.lua")).to.be.true
    }

    @test "Transpile using ArgumentReader"() {

        mockfs({
            "myFile.ts": `console.log(true);`
        });

        const cli = new CommandLine([
            "-t", "lua", "-f", "myFile.ts"
        ]);

        cli.execute();

        expect(fs.existsSync("myFile.lua")).to.be.true;
    }
}