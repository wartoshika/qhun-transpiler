import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Function special properties", slow(1000), timeout(10000)) class LuaFunctionSpecial extends UnitTest {


    @test "function.bind(...)"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    const a = ()=>{};
                    const b = a.bind("test");
                `,
                expected: [
                    "local a = function ()",
                    "end",
                    `local b = __function_bind(a, {"test"})`
                ],
                expectedAditionalDeclaration: [
                    "function.bind"
                ]
            },
            {
                code: `
                    const a = (a:number, b: number)=>{
                        return a+b;
                    };
                    const b = a.bind(1, 2);
                `,
                expected: [
                    "local a = function (a, b)",
                    "  return a + b",
                    "end",
                    `local b = __function_bind(a, {1, 2})`
                ],
                expectedAditionalDeclaration: [
                    "function.bind"
                ]
            }
        ]);

    }
}