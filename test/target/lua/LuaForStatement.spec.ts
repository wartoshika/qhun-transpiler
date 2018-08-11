import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | For", slow(1000), timeout(10000)) class LuaFor extends UnitTest {


    @test "Simple for statement"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    for(let i = 0; i<10; i++) {
                        const a = i;
                    }
                `,
                expected: [
                    `do`,
                    `  local i = 0`,
                    `  while i < 10 do`,
                    `    local a = i`,
                    `    i = i + 1`,
                    `  end`,
                    `end`
                ]
            }
        ]);

    }

    @test "For with multiple initializers"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    for(let i = 0, b = 5; i<10 && b < 15; i++) {
                        const a = i;
                    }
                `,
                expected: [
                    `do`,
                    `  local i = 0`,
                    `  local b = 5`,
                    `  while i < 10 and b < 15 do`,
                    `    local a = i`,
                    `    i = i + 1`,
                    `  end`,
                    `end`
                ]
            }
        ]);

    }

}