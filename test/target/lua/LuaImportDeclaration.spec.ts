import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { UnsupportedError } from "../../../src/error/UnsupportedError";

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

    @test "Namespace imports"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `import * as b from "./a";`,
                expected: [
                    `local b = require("./a")`
                ]
            }
        ])
    }
}