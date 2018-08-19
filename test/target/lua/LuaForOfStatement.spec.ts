import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | ForOf", slow(1000), timeout(10000)) class LuaForOf extends UnitTest {


    @test "Simple forOf statement"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    for(let i of arr) {
                        run(i)
                    }
                `,
                expected: [
                    `for _, i in pairs(arr) do`,
                    `  run(i)`,
                    `end`
                ]
            }
        ]);

    }

    @test "ForOf statement with array type"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    const myArr: any[] = [1,2,3]
                    for(let i of myArr) {
                        run(i)
                    }
                `,
                expected: [
                    `local myArr = {1, 2, 3}`,
                    `for _, i in ipairs(myArr) do`,
                    `  run(i)`,
                    `end`
                ]
            }, {
                code: `
                    for(let i of [1,2,3]) {
                        run(i)
                    }
                `,
                expected: [
                    `for _, i in ipairs({1, 2, 3}) do`,
                    `  run(i)`,
                    `end`
                ]
            }
        ]);

    }
}