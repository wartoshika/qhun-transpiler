import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Do", slow(1000), timeout(10000)) class LuaEnum extends UnitTest {


    @test "Simple do while statement"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    do {
                        const a = "1";
                    } while(a > 10);
                `,
                expected: [
                    `repeat`,
                    `  local a = "1"`,
                    `until not (a > 10)`
                ]
            }
        ]);

    }

    @test "Do statement with break"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    do {
                        if(true) {
                            break;
                        }
                    } while(a > 10);
                `,
                expected: [
                    `repeat`,
                    `  if true then`,
                    `    break`,
                    `  end`,
                    `until not (a > 10)`
                ]
            }
        ]);
    }

}