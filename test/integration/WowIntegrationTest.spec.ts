import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";

import * as mockfs from "mock-fs";
import * as fs from "fs";
import { WowKeywords } from "../../src/target/wow/WowKeywords";
import { IntegrationTestBase } from "./IntegrationTestBase";
import { WowConfig } from "../../src/target/wow/WowConfig";

@suite("[Integration] Complete transpile test for target wow", slow(500), timeout(3000)) class LuaIntegrationTest extends IntegrationTestBase {

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
            this.integrationTranspile<WowConfig>(
                {
                    target: "wow",
                    config: {
                        visibleName: "name",
                        interface: 12343
                    }
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
        expect(fs.existsSync(`dist/${this.getProject("lua").name}.toc`)).to.equal(true, "TOC file has not been generated");
        expect(fs.existsSync(`dist/${WowKeywords.IMPORT_LIB_NAME}.lua`)).to.equal(true, "Library file has not been created");
    }
}