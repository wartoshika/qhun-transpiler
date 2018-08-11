import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | If", slow(1000), timeout(10000)) class LuaIfStatement extends UnitTest {


    @test "Simple without else statement"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `if(a && true) { let a = true; }`,
                expected: [
                    `if a and true then`,
                    `  local a = true`,
                    `end`
                ]
            }
        ]);

    }
}