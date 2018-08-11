import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Variables", slow(1000), timeout(10000)) class LuaWhileStatement extends UnitTest {


    @test "Simple while"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `while (true) {}`,
                expected: [
                    `while true do`,
                    `end`
                ]
            }
        ]);

    }

    @test "With while body and break"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    while (a && (b || c)) {
                        if(a) {
                            break;
                        }
                    }
                `,
                expected: [
                    `while a and (b or c) do`,
                    `  if a then`,
                    `    break`,
                    `  end`,
                    `end`
                ]
            }
        ]);
    }

}