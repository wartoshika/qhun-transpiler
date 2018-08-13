import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Binary expressions", slow(1000), timeout(10000)) class LuaBinaryExpressions extends UnitTest {


    @test "&&, **, ||, ===, ==, !=, !=="() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `1 && 2`,
                expected: [`1 and 2`]
            }, {
                code: `1**2`,
                expected: [`1 ^ 2`]
            }, {
                code: `1!==2`,
                expected: [`1 ~= 2`]
            }, {
                code: `a || b && 1`,
                expected: [`a or b and 1`]
            }, {
                code: `1 === true || false != "text"`,
                expected: [`1 == true or false ~= "text"`]
            }, {
                code: `const a = true && (a || b);`,
                expected: [`local a = true and (a or b)`]
            }
        ]);

    }

    @test "+ token"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `1+2`,
                expected: [`1 + 2`]
            }, {
                code: `"1"+"2"`,
                expected: [`"1" .. "2"`]
            }, {
                code: `"1" + 2`,
                expected: [`"1" .. 2`]
            }, {
                code: `1 + "2"`,
                expected: [`1 .. "2"`]
            }, {
                code: `const a: string = "a"; const b = a + 2;`,
                expected: [
                    `local a = "a"`,
                    `local b = a .. 2`
                ]
            }, {
                code: `const a = 5; const b = a + 4;`,
                expected: [
                    `local a = 5`,
                    `local b = a + 4`
                ]
            }
        ]);
    }

    @test "*, -, /, %, <=, <, >, >="() {
        this.runCodeAndExpectResult("lua", [
            {
                code: `1*1`,
                expected: [`1 * 1`]
            }, {
                code: `1-1`,
                expected: [`1 - 1`]
            }, {
                code: `1/1`,
                expected: [`1 / 1`]
            }, {
                code: `1%1`,
                expected: [`1 % 1`]
            }, {
                code: `1<=1`,
                expected: [`1 <= 1`]
            }, {
                code: `1< 1`,
                expected: [`1 < 1`]
            }, {
                code: `1>1`,
                expected: [`1 > 1`]
            }, {
                code: `1>=1`,
                expected: [`1 >= 1`]
            }
        ]);
    }

    @test "bit operations ( &, |, ^ )"() {
        this.runCodeAndExpectResult("lua", [
            {
                code: `1 & 2`,
                expected: [`__bitop_and(1, 2)`],
                expectedAditionalDeclaration: [
                    `bitop.and`, `bitop.make`
                ]
            }, {
                code: `1 | 2`,
                expected: [`__bitop_or(1, 2)`],
                expectedAditionalDeclaration: [
                    `bitop.or`, `bitop.make`
                ]
            }, {
                code: `1 ^ 2`,
                expected: [`__bitop_xor(1, 2)`],
                expectedAditionalDeclaration: [
                    `bitop.xor`, `bitop.make`
                ]
            }
        ]);
    }
}