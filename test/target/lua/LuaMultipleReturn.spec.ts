import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { UnsupportedError } from "../../../src/error/UnsupportedError";

@suite("[Unit] Target: Lua | Multiple return values", slow(1000), timeout(10000)) class LuaMultipleReturn extends UnitTest {


    @test "Function tuple return and array destructing assignment"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `function abc(): [string, number] {
                    return ["test", 1]
                }
                const [myString, myNumber] = abc();
                `,
                expected: [
                    `local function abc()`,
                    `  return "test", 1`,
                    `end`,
                    `local myString, myNumber = abc()`
                ]
            }
        ]);

    }

    @test "Array destruction with omitted expression"() {

        this.runCodeAndExpectResult("lua", [{
            code: `const [a,,c] = d()`,
            expected: [
                `local a, _, c = d()`
            ]
        }])
    }

    @test "Array destructing with ... token is unsupported"() {

        this.runCodeAndExpectThrow("lua", [{
            code: `const [a, b, ...c] = d()`,
            throw: UnsupportedError
        }])
    }

}