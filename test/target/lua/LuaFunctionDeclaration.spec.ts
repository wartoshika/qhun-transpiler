import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Function declaration", slow(1000), timeout(10000)) class LuaEnum extends UnitTest {


    @test "Named declaration without arguments"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    function a() {}
                `,
                expected: [
                    `local function a()`,
                    `end`
                ]
            }
        ]);

    }

    @test "Named declaration with arguments"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    function a(a: string, b?: boolean): boolean {
                        return true;
                    }
                `,
                expected: [
                    `local function a(a, b)`,
                    `  return true`,
                    `end`
                ]
            }, {
                code: `
                function a(a: string, b?: boolean, ...c?: any[]): boolean {
                    return true;
                }
                `,
                expected: [
                    `local function a(a, b, ...)`,
                    `  local c = {...}`,
                    `  return true`,
                    `end`
                ]
            }
        ]);

    }

    @test "Unnamed function declaration"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    function(a,b,c) {
                        return a + b;
                    }
                `,
                expected: [
                    `local function (a, b, c)`,
                    `  return a + b`,
                    `end`
                ]
            }
        ]);
    }

    @test "Arrow function"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    const a = ()=>{}
                `,
                expected: [
                    `local a = function ()`,
                    `end`
                ]
            }
        ]);
    }

}