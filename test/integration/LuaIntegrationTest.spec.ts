import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";

import * as mockfs from "mock-fs";
import * as fs from "fs";
import { CommandLine } from "../../src/cli/CommandLine";
import { IntegrationTestBase } from "./IntegrationTestBase";

@suite("[Integration] Complete transpile test for target lua", slow(500), timeout(3000)) class LuaIntegrationTest extends IntegrationTestBase {

    public after() {
        mockfs.restore();
    }

    @test "Transpile using JsonReader"() {

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

        expect(
            this.integrationTranspile(
                {
                    target: "lua"
                }, {
                    "index.ts": indexTs,
                    "a.ts": aTs,
                    "b.ts": bTs,
                    "c.ts": cTs
                }
            )
        ).to.equal(true);


        // dist files must exists
        expect(fs.existsSync("dist/index.lua")).to.be.true;
        expect(fs.existsSync("dist/a.lua")).to.be.true;
        expect(fs.existsSync("dist/b.lua")).to.be.true;
        expect(fs.existsSync("dist/c.lua")).to.be.true;
    }

    @test "Transpile using ArgumentReader"() {

        mockfs({
            "myFile.ts": `console.log(true);`
        });

        const cli = new CommandLine([
            "-t", "lua", "-f", "myFile.ts"
        ]);
        cli.prepare();
        cli.execute();

        expect(fs.existsSync("myFile.lua")).to.be.true;
    }
}