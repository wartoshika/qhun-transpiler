import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";
import { JsonReader } from "../../src/config/json/JsonReader";
import * as mockfs from "mock-fs";
import { FileNotExistsError } from "../../src/error/FileNotExistsError";
import { UnexpectedError } from "../../src/error/UnexpectedError";
import { JsonConfig } from "../../src/config/json/JsonConfig";
import * as path from "path";
import { ValidationError } from "../../src/error/ValidationError";

@suite("[Unit] JsonReader", slow(500), timeout(3000)) class JsonReaderTest {

    public after(): void {
        mockfs.restore();
    }

    @test "Can read an existing config environment"() {

        let projectObject: JsonConfig = {
            author: "wartoshika",
            config: {},
            entry: "./my/entry.ts",
            description: "description test",
            licence: "MIT",
            name: "my Cool Name",
            outDir: "dist",
            target: "lua",
            version: "1.0.0",
            printFileHeader: false,
            tsconfig: "./mytsconfig.json"
        } as any;

        let tsconfig: any = {
            compilerOptions: {
                module: "commonjs",
                noImplicitAny: true,
                removeComments: true,
                preserveConstEnums: true,
                experimentalDecorators: true,
                emitDecoratorMetadata: true,
                outDir: "dist",
                moduleResolution: "node",
                target: "es5",
                sourceMap: true
            },
            include: [
                "./src/**/*.ts"
            ]
        };

        // mock a json file and tsconfig file
        mockfs({
            "qhun-transpiler.json": JSON.stringify(projectObject),
            "mytsconfig.json": JSON.stringify(tsconfig),
            "src": {
                "a.ts": `export const a = "testA";`,
                "b.ts": `export const b = "testB";`,
                "index.ts": `import {a} from "./a"; import {b} from "./b"; console.log(a, b);`
            }
        });

        // construct the json reader
        const reader = new JsonReader("./qhun-transpiler.json");

        // read the data
        const project = reader.read();

        // all files must be there
        expect(project.parsedCommandLine.fileNames).to.deep.equal([
            path.resolve("src/a.ts").replace(/\\/g, "/"),
            path.resolve("src/b.ts").replace(/\\/g, "/"),
            path.resolve("src/index.ts").replace(/\\/g, "/")
        ]);
    }

    @test "Throws on non existing file"() {

        mockfs({});
        let thrown: boolean = false;

        try {
            new JsonReader("nonExistingPath").read();
        } catch (e) {
            expect(e).to.be.an.instanceof(FileNotExistsError);
            thrown = true;
        }

        if (!thrown) {
            expect(false).to.equal(true, "Expection FileNotExistsError has not been thrown!");
        }
    }

    @test "Throws on malformed json format"() {

        mockfs({
            "my.json": "{malformed json!"
        });
        let thrown: boolean = false;

        try {
            new JsonReader("./my.json").read();
        } catch (e) {
            expect(e).to.be.an.instanceof(UnexpectedError);
            thrown = true;
        }

        if (!thrown) {
            expect(false).to.equal(true, "Expection UnexpectedError has not been thrown!");
        }
    }

    @test "Throws tsconfig.json file errors"() {

        let projectObject: JsonConfig = {
            author: "wartoshika",
            config: {},
            entry: "./my/entry.ts",
            description: "description test",
            licence: "MIT",
            name: "my Cool Name",
            outDir: "dist",
            target: "lua",
            version: "1.0.0",
            printFileHeader: false,
            tsconfig: "./myothertsconfig.json"
        } as any;

        // mock a json file and tsconfig file
        mockfs({
            "qhun-transpiler.json": JSON.stringify(projectObject)
        });

        let thrown: boolean = false;

        try {
            new JsonReader("./qhun-transpiler.json").read();
        } catch (e) {
            expect(e).to.be.an.instanceof(ValidationError);
            thrown = true;
        }

        if (!thrown) {
            expect(false).to.equal(true, "Expection ValidationError has not been thrown!");
        }

        // ------------------------
        mockfs.restore();
        thrown = false;

        mockfs({
            "qhun-transpiler.json": JSON.stringify(projectObject),
            "myothertsconfig.json": "{ malformed tsconfig.json"
        });

        try {
            new JsonReader("./qhun-transpiler.json").read();
        } catch (e) {
            expect(e).to.be.an.instanceof(UnexpectedError);
            thrown = true;
        }

        if (!thrown) {
            expect(false).to.equal(true, "Expection UnexpectedError has not been thrown!");
        }

    }
}