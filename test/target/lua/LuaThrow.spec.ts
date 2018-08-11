import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Throw", slow(1000), timeout(10000)) class LuaThrow extends UnitTest {


    @test "Supported throw statements"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `throw "test"`,
                expected: [
                    `error("test")`
                ]
            }, {
                code: `const a = "myErrorMessage"; throw a;`,
                expected: [
                    `local a = "myErrorMessage"`,
                    `error(tostring(a))`
                ]
            }, {
                code: `const a: string = "myErrorMessage"; throw a;`,
                expected: [
                    `local a = "myErrorMessage"`,
                    `error(a)`
                ]
            }, {
                code: `throw 1;`,
                expected: [
                    `error(tostring(1))`
                ]
            }
        ]);

    }

}