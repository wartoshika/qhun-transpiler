import { suite, test } from "mocha-typescript";
import { UnitTest, TestCodeAndResult } from "../../UnitTest";
import { LuaTarget } from "../../../src/target/lua/LuaTarget";

import * as ts from "typescript";
import { Transpiler } from "../../../src/transpiler/Transpiler";

@suite("[Unit] Target: Lua") class LuaBinaryExpressions extends UnitTest {


    @test "Binary expressions"() {

        this.runCodeAndExpectResult([
            {
                code: `1 && 2`,
                expected: [`1 and 2`]
            }, {
                code: `1**2`,
                expected: [`1^2`]
            }, {
                code: `1!==2`,
                expected: [`1~=2`]
            }, {
                code: `a || b && 1`,
                expected: [`a or b and 1`]
            }, {
                code: `1 === true || false != "text"`,
                expected: [`1==true or false~="text"`]
            }
        ]);

    }
}