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
                    `myFunc(a, table.unpack(b))`
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

}