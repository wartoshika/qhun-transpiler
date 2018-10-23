import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { UnsupportedError } from "../../../src/error/UnsupportedError";
import { WowKeywords } from "../../../src/target/wow/WowKeywords";
import { WowConfig } from "../../../src/target/wow/WowConfig";
import { LuaKeywords } from "../../../src/target/lua/LuaKeywords";

@suite("[Unit] Target: Wow | Exports", slow(1000), timeout(10000)) class WowExports extends UnitTest {

    public before() {

        // make sure that the project data is available
        this.lastProject = this.getProject("wow", {} as WowConfig);
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
                `${WowKeywords.IMPORT_LIB_NAME}.declare("36d5a0b4f9952122e49ca2e22938ab73", ${LuaKeywords.EXPORT_LOCAL_NAME})`
            ]
        }], {
                personalizedLibrary: false
            });
    }

    @test "Namespace exports (export * from )"() {

        this.runCodeAndExpectResult("wow", [{
            code: `export * from "./a";`,
            expected: [
                `local __FILE_META = {...}`,
                `local ${LuaKeywords.EXPORT_LOCAL_NAME} = {`,
                `}`,
                `for mod, data in pairs(${WowKeywords.IMPORT_LIB_NAME}.get("57a3494e7efa4eba07c02b3bdf1224e3")) do`,
                `  ${LuaKeywords.EXPORT_LOCAL_NAME}[mod] = data`,
                `end`,
                `${WowKeywords.IMPORT_LIB_NAME}.declare("36d5a0b4f9952122e49ca2e22938ab73", ${LuaKeywords.EXPORT_LOCAL_NAME})`
            ]
        }], {
                personalizedLibrary: false
            });
    }
}