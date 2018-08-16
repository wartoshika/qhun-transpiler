import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { LuaBinaryOperationsFunctions } from "../../../src/target/lua/special/LuaBinaryOperations";

@suite("[Unit] Target: Lua | Prefix and Postfix unary expressions", slow(1000), timeout(10000)) class LuaPrefixPostfixExpression extends UnitTest {


    @test "Prefix unary"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `++a`,
                expected: [
                    `a = a + 1`
                ]
            }, {
                code: `--a`,
                expected: [
                    `a = a - 1`
                ]
            }, {
                code: `!a`,
                expected: [
                    `(not a)`
                ]
            }, {
                code: `-a`,
                expected: [
                    `-a`
                ]
            }, {
                code: `~a`,
                expected: [
                    `${LuaBinaryOperationsFunctions.NOT}(a)`
                ],
                expectedAditionalDeclaration: [
                    "bitop.make", "bitop.not"
                ]
            }
        ]);

    }

    @test "Postfix unary"() {

        this.runCodeAndExpectResult("lua", [{
            code: `a++`,
            expected: [
                `a = a + 1`
            ]
        }, {
            code: `a--`,
            expected: [
                `a = a - 1`
            ]
        }]);
    }
}