import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { LuaKeywords } from "../../../src/target/lua/LuaKeywords";

@suite("[Unit] Target: Lua | ExportDeclaration", slow(1000), timeout(10000)) class LuaExportDeclaration extends UnitTest {


    @test "export * from statement"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `export * from "b";`,
                expected: [
                    `local ${LuaKeywords.EXPORT_LOCAL_NAME} = {`,
                    `}`,
                    `__export = __global_requireall("b", __export)`,
                    `return ${LuaKeywords.EXPORT_LOCAL_NAME}`
                ],
                expectedAditionalDeclaration: [
                    "global.requireall"
                ]
            }
        ]);

    }
}