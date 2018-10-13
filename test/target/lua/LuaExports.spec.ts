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
                    `local ${LuaKeywords.EXPORT_LOCAL_NAME} = {`,
                    `  abc = abc`,
                    `}`,
                    `return ${LuaKeywords.EXPORT_LOCAL_NAME}`
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
                    `local ${LuaKeywords.EXPORT_LOCAL_NAME} = {`,
                    `  a = a,`,
                    `  b = b`,
                    `}`,
                    `return ${LuaKeywords.EXPORT_LOCAL_NAME}`
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
                    `  local ${LuaKeywords.CLASS_INSTANCE_LOCAL_NAME} = setmetatable({}, A)`,
                    `  if self and A.${LuaKeywords.CLASS_PREPARE_NON_STATIC} then`,
                    `    A.${LuaKeywords.CLASS_PREPARE_NON_STATIC}(${LuaKeywords.CLASS_INSTANCE_LOCAL_NAME})`,
                    `  end`,
                    `  if self and A.${LuaKeywords.CLASS_INIT_FUNCTION_NAME} then`,
                    `    A.${LuaKeywords.CLASS_INIT_FUNCTION_NAME}(${LuaKeywords.CLASS_INSTANCE_LOCAL_NAME}, ...)`,
                    `  end`,
                    `  return ${LuaKeywords.CLASS_INSTANCE_LOCAL_NAME}`,
                    `end`,
                    `function A.${LuaKeywords.CLASS_INIT_FUNCTION_NAME}(self)`,
                    `end`,
                    `local ${LuaKeywords.EXPORT_LOCAL_NAME} = {`,
                    `  A = A`,
                    `}`,
                    `return ${LuaKeywords.EXPORT_LOCAL_NAME}`
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
                `local ${LuaKeywords.EXPORT_LOCAL_NAME} = {`,
                `  Test = Test`,
                `}`,
                `return ${LuaKeywords.EXPORT_LOCAL_NAME}`
            ]
        }]);
    }
}