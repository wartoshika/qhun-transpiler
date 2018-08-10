import { suite, test } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua") class LuaIfStatement extends UnitTest {


    @test "If statements"() {

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