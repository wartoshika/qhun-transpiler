import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | CallExpression", slow(1000), timeout(10000)) class LuaCallExpression extends UnitTest {


    @test "Simple calls"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `myFunc()`,
                expected: [
                    `myFunc()`
                ]
            }, {
                code: `myFunc(a, b, a && b, c())`,
                expected: [
                    `myFunc(a, b, a and b, c())`
                ]
            }
        ]);

    }

    @test "SpreadElement as argument"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `myFunc(a, ...b)`,
                expected: [
                    `myFunc(a, unpack(b))`
                ]
            }
        ]);
    }

    @test "Function call from object access"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `obj.myFunc(a)`,
                expected: [
                    `obj:myFunc(a)`
                ]
            }, {
                code: `a.b.c.d(e)`,
                expected: [
                    `a.b.c:d(e)`
                ]
            }
        ]);
    }

    @test "Multiple calls in one line"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `obj.myFunc().myOtherFunc().test();`,
                expected: [
                    `obj:myFunc():myOtherFunc():test()`
                ]
            }
        ])
    }

    @test "This argument in function declaration"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    const fktn: (this: any, arg1: string) => void = (arg1: string) => {};
                    const obj = {
                        test: fktn
                    }
                    obj.test("hello");
                `,
                expected: [
                    "local fktn = function (arg1)",
                    "end",
                    "local obj = {test = fktn}",
                    "obj.test(\"hello\")"
                ]
            }
        ])
    }

    @test "*.toString(...) calls"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    const n: number = 10;
                    const b = n.toString();
                `,
                expected: [
                    "local n = 10",
                    "local b = tostring(n)"
                ]
            }, {
                code: `
                    const n: number = 10;
                    const b = n.toString(10);
                `,
                expected: [
                    "local n = 10",
                    `local b = string.format("%d", tostring(n))`
                ]
            }, {
                code: `
                    const n: number = 10;
                    const b = n.toString(16);
                `,
                expected: [
                    "local n = 10",
                    `local b = string.format("%x", tostring(n))`
                ]
            }
        ]);
    }

}