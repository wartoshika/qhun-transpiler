import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { WowKeywords } from "../../../src/target/wow/WowKeywords";
import { LuaKeywords } from "../../../src/target/lua/LuaKeywords";

@suite("[Unit] Target: Wow | Exports", slow(1000), timeout(10000)) class WowExports extends UnitTest {

    public before() {

        // make sure that the project data is available
        this.lastProject = this.getProject("wow");
    }

    @test "Function export"() {

        this.runCodeAndExpectResult("wow", [{
            code: `export function abc() {}`,
            expected: [
                `local __FILE_META = {...}`,
                `local function abc()`,
                `end`,
                `local ${LuaKeywords.EXPORT_LOCAL_NAME} = {`,
                `  abc = abc`,
                `}`,
                `${WowKeywords.FILE_META_IMPORT_EXPORT}.declare("__test_0", ${LuaKeywords.EXPORT_LOCAL_NAME})`
            ]
        }]);
    }

    @test "Namespace exports (export * from )"() {

        this.runCodeAndExpectResult("wow", [{
            code: `export * from "./a";`,
            expected: [
                `local __FILE_META = {...}`,
                `local ${LuaKeywords.EXPORT_LOCAL_NAME} = {`,
                `}`,
                `for mod, data in pairs(${WowKeywords.FILE_META_IMPORT_EXPORT}.get("__index_0")) do`,
                `  ${LuaKeywords.EXPORT_LOCAL_NAME}[mod] = data`,
                `end`,
                `${WowKeywords.FILE_META_IMPORT_EXPORT}.declare("__test_1", ${LuaKeywords.EXPORT_LOCAL_NAME})`
            ]
        }]);
    }
}