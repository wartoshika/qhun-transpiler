import { suite, test } from "mocha-typescript";
import { UnitTest, TestCodeAndResult } from "../../UnitTest";
import { LuaTarget } from "../../../src/target/lua/LuaTarget";

import * as ts from "typescript";
import { Transpiler } from "../../../src/transpiler/Transpiler";

@suite("[Unit] Target: Lua") class LuaVariables extends UnitTest {


    @test "Variables with StringLiterals"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `const myVar = "test";`,
                expected: [`local myVar = "test"`]
            }, {
                code: `const myVar: string = "test";`,
                expected: [`local myVar = "test"`]
            }
        ]);

    }

    @test "Variables with NumericLiterals"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `let myNumber = 5;`,
                expected: [`local myNumber = 5`]
            }, {
                code: `let myNumber: number;`,
                expected: [`local myNumber = nil`]
            }
        ]);
    }

    @test "Variables with ArrayLiterals"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `const myArray = [];`,
                expected: [`local myArray = {}`]
            }, {
                code: `let myArray = [5,1,"test"];`,
                expected: [`local myArray = {5,1,"test"}`]
            }
        ]);
    }

    @test "Variables with ObjectLiterals"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `const myObj = {};`,
                expected: [`local myObj = {}`]
            }, {
                code: `let myObj = {flat: 1, object: "test"};`,
                expected: [`local myObj = {flat=1,object="test"}`]
            }, {
                code: `const myObj = {a: {deep: {obj: true}}};`,
                expected: [`local myObj = {a={deep={obj=true}}}`]
            }
        ]);
    }
}