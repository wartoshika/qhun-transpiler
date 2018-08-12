import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Conditional expressions", slow(1000), timeout(10000)) class LuaConditionalExpression extends UnitTest {


    @test "Simple conditions"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `true ? 1 : 2`,
                expected: [
                    `__global_tenary(true, 1, 2)`
                ]
            }
        ]);

    }

    @test "Neasted conditions"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    const a = true ? otherTrue ? 1 : 2 : callFunction(myVal ? "yes" : "no")
                `,
                expected: [
                    `local a = __global_tenary(true, __global_tenary(otherTrue, 1, 2), callFunction(__global_tenary(myVal, "yes", "no")))`
                ]
            }
        ]);
    }

}