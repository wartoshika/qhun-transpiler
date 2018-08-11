import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Imports", slow(1000), timeout(10000)) class LuaImportDeclaration extends UnitTest {


    @test "Names imports"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `import {A} from "./a"`,
                expected: [
                    `local A = require("./a").A`
                ]
            }, {
                code: `import { A as B } from "./a";`,
                expected: [
                    `local B = require("./a").A`
                ]
            }
        ]);

    }

    @test "Multiple named imports"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `import {A, B, C as D} from "./a"`,
                expected: [
                    `local A = require("./a").A`,
                    `local B = require("./a").B`,
                    `local D = require("./a").C`
                ]
            }
        ]);

    }
}