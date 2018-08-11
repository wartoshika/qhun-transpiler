import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { UnsupportedError } from "../../../src/error/UnsupportedError";

@suite("[Unit] Target: Lua | ForIn", slow(1000), timeout(10000)) class LuaForIn extends UnitTest {


    @test "Simple ForIn statement"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    for(let a in b) {
                        const b = a;
                    }
                `,
                expected: [
                    `for a, _ in pairs(b) do`,
                    `  local b = a`,
                    `end`
                ]
            }, {
                code: `for(let a in b) {}`,
                expected: [
                    `for a, _ in pairs(b) do`,
                    `end`
                ]
            }
        ]);

    }

    @test "Unsupported for .. in tests"() {

        this.runCodeAndExpectThrow("lua", [
            {
                code: `for(let a,b in c) {}`,
                throw: UnsupportedError
            }, {
                code: `
                    const a: any[] = [1,2,3];
                    for(let b in a) {
                        func(b);
                    }
                `,
                throw: UnsupportedError
            }
        ])
    }

}