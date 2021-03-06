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
            },
            {
                code: `
                    const a = () => 1
                `,
                expected: [
                    "local a = function ()",
                    "  return 1",
                    "end"
                ]
            }
        ]);
    }

    @test "Function signature overload"() {

        this.runCodeAndExpectResult("lua", [{
            code: `
                function test(a: string): void;
                function test(a: number): void;
                function test(a: any): void {
                    run(a);
                }
            `,
            expected: [
                `local function test(a)`,
                `  run(a)`,
                `end`
            ]
        }])
    }

}