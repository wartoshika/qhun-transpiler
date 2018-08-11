import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Enum", slow(1000), timeout(10000)) class LuaEnum extends UnitTest {


    @test "Enum"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    enum MyEnum {
                        A = 1,
                        B = 2,
                        C = 3
                    }
                `,
                expected: [
                    `local MyEnum = {`,
                    `  A = 1,`,
                    `  B = 2,`,
                    `  C = 3`,
                    `}`
                ]
            }, {
                code: `
                    enum MyStringEnum {
                        A = "TEST",
                        B = "TEST2"
                    }
                `,
                expected: [
                    `local MyStringEnum = {`,
                    `  A = "TEST",`,
                    `  B = "TEST2"`,
                    `}`
                ]
            }, {
                code: `
                    enum MyNonInitEnum {
                        A, B, C
                    }
                `,
                expected: [
                    `local MyNonInitEnum = {`,
                    `  A = 1,`,
                    `  B = 2,`,
                    `  C = 3`,
                    `}`
                ]
            }
        ]);

    }

    @test "Enum export"() {

        this.runCodeAndExpectResult("lua", [{
            code: `
                export enum MyExportEnum {
                    A, B
                }
            `,
            expected: [
                `local MyExportEnum = {`,
                `  A = 1,`,
                `  B = 2`,
                `}`
            ]
        }])
    }
}