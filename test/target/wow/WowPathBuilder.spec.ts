import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { WowKeywords } from "../../../src/target/wow/WowKeywords";


@suite("[Unit] Target: Wow | Path building", slow(1000), timeout(10000)) class WowPathBuilderTest extends UnitTest {

    @test "path building using target file based hash"() {

        this.runCodeAndExpectResult("wow", [{
            code: `import {C} from "./test";`,
            expected: [
                "local __FILE_META = {...}",
                `local C = ${WowKeywords.FILE_META_IMPORT_EXPORT}.get("__index_0").C`
            ]
        }, {
            code: `import {D as Q} from "./test/test2";`,
            expected: [
                "local __FILE_META = {...}",
                `local Q = ${WowKeywords.FILE_META_IMPORT_EXPORT}.get("__index_0").D`
            ]
        }, {
            code: `import {D} from "@wartoshika/test/test2";`,
            expected: [
                "local __FILE_META = {...}",
                `local D = ${WowKeywords.FILE_META_IMPORT_EXPORT}.get("__index_0").D`
            ]
        }, {
            code: `import {D} from "@wartoshika/test/test2/../test2";`,
            expected: [
                "local __FILE_META = {...}",
                `local D = ${WowKeywords.FILE_META_IMPORT_EXPORT}.get("__index_0").D`
            ]
        }])
    }
}