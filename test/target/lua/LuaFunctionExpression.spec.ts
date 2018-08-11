import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Function expressions", slow(1000), timeout(10000)) class LuaFunctionExpression extends UnitTest {


    @test "Arrow function expression with arguments"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    const a = (a: string, b = true, ...c: any[]) => {
                        return a && b;
                    }
                `,
                expected: [
                    `local a = function (a, b, ...)`,
                    `  local c = {...}`,
                    `  if b == nil then b = true end`,
                    `  return a and b`,
                    `end`
                ]
            }
        ]);

    }
}