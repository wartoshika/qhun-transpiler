import * as mockfs from "mock-fs";
import { JsonConfig } from "../../src/config/json/JsonConfig";
import { DefaultConfig } from "../../src/config/DefaultConfig";
import * as fs from "fs";
import { CommandLine } from "../../src/cli/CommandLine";
import { Test } from "../Test";

export class IntegrationTestBase extends Test {

    public integrationTranspile(projectConfig: Partial<JsonConfig>, fsConfig: mockfs.Config): boolean {

        const transpileConfig: JsonConfig = DefaultConfig.mergeDefaultProjectData(projectConfig);
        transpileConfig.tsconfig = "testTsConfig.json";
        transpileConfig.stripOutDir = "src";
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

        // create filesystem
        mockfs({
            "testTranspilerConfig.json": JSON.stringify(transpileConfig),
            "testTsConfig.json": JSON.stringify(tsconfig),
            "src": fsConfig,
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
            "-p", "testTranspilerConfig.json"
        ]);

        return cli.execute();
    }
}
