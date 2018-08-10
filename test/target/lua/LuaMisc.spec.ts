import { suite, test } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua") class LuaIfStatement extends UnitTest {


    @test "Unrechable code after return"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `if(true) { return true; const a = false; }`,
                expected: [
                    `if true then`,
                    `  return true`,
                    `end`
                ]
            }
        ]);

    }
}