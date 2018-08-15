import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { LuaKeywords } from "../../../src/target/lua/LuaKeywords";

@suite("[Unit] Target: Exports", slow(1000), timeout(10000)) class LuaExports extends UnitTest {


    @test "Function export"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `export function abc() {}`,
                expected: [
                    `local function abc()`,
                    `end`,
                    `return {`,
                    `  abc = abc`,
                    `}`
                ]
            }
        ]);
    }

    @test "Variable export"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `export const a: string = "test"; export let b = "test2"; const c = "test3";`,
                expected: [
                    `local a = "test"`,
                    `local b = "test2"`,
                    `local c = "test3"`,
                    `return {`,
                    `  a = a,`,
                    `  b = b`,
                    `}`
                ]
            }
        ]);
    }

    @test "Class export"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `export class A {}`,
                expected: [
                    `local A = {}`,
                    `A.__index = A`,
                    `function A.${LuaKeywords.CLASS_NEW_FUNCTION_NAME}(self, ...)`,
                    `  local instance = setmetatable({}, A)`,
                    `  if self and A.${LuaKeywords.CLASS_INIT_FUNCTION_NAME} then`,
                    `    A.${LuaKeywords.CLASS_INIT_FUNCTION_NAME}(instance, ...)`,
                    `  end`,
                    `  return instance`,
                    `end`,
                    `function A.${LuaKeywords.CLASS_INIT_FUNCTION_NAME}(self)`,
                    `end`,
                    `return {`,
                    `  A = A`,
                    `}`
                ]
            }
        ])
    }

    @test "Enum export"() {

        this.runCodeAndExpectResult("lua", [{
            code: `export enum Test { A, B }`,
            expected: [
                `local Test = {`,
                `  A = 1,`,
                `  B = 2`,
                `}`,
                `return {`,
                `  Test = Test`,
                `}`
            ]
        }]);
    }
}