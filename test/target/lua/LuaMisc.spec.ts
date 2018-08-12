import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Misc", slow(1000), timeout(10000)) class LuaMisc extends UnitTest {


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

    @test "Unrechable code after break"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    while (true) {
                        if(true) {
                            break;
                            const a = true;
                        }
                    }
                `,
                expected: [
                    `while true do`,
                    `  if true then`,
                    `    break`,
                    `  end`,
                    `end`
                ]
            }
        ]);

    }
}