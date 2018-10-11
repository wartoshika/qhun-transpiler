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
                `local function abc()`,
                `end`,
                `local ${LuaKeywords.EXPORT_LOCAL_NAME} = {`,
                `  abc = abc`,
                `}`,
                `${WowKeywords.IMPORT_LIB_NAME}.declare("test", ${LuaKeywords.EXPORT_LOCAL_NAME})`
            ]
        }], {
                personalizedLibrary: false
            });
    }

    @test "Namespace exports (export * from )"() {

        this.runCodeAndExpectResult("wow", [{
            code: `export * from "./a";`,
            expected: [
                `local ${LuaKeywords.EXPORT_LOCAL_NAME} = {`,
                `}`,
                `for mod, data in pairs(${WowKeywords.IMPORT_LIB_NAME}.get("a")) do`,
                `  ${LuaKeywords.EXPORT_LOCAL_NAME}[mod] = data`,
                `end`,
                `${WowKeywords.IMPORT_LIB_NAME}.declare("test", ${LuaKeywords.EXPORT_LOCAL_NAME})`
            ]
        }], {
                personalizedLibrary: false
            });
    }
}