import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Element access expression", slow(1000), timeout(10000)) class LuaElementAccessExpression extends UnitTest {


    @test "Simple and chained access"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    a[b]
                `,
                expected: [
                    `a[b]`
                ]
            }, {
                code: `
                    a[b][c[1]].d(d["string"][func()])
                `,
                expected: [
                    `a[b][c[1]]:d(d["string"][func()])`
                ]
            }
        ]);

    }

    @test "Special cases string and array"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    const myStr: string = "test";
                    call(myStr[0])
                `,
                expected: [
                    `local myStr = "test"`,
                    `call(string.sub(myStr, (tonumber(0) + 1)))`
                ]
            }, {
                code: `
                    const myArray: number[] = [1,2];
                    call(myArray[0])
                `,
                expected: [
                    `local myArray = {1, 2}`,
                    `call(myArray[(tonumber(0) + 1)])`
                ]
            }
        ]);
    }

}