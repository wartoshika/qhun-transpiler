import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua", slow(1000), timeout(10000)) class LuaIfStatement extends UnitTest {


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