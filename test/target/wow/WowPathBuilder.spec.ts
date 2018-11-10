import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";


@suite("[Unit] Target: Wow | Path building", slow(1000), timeout(10000)) class WowPathBuilderTest extends UnitTest {

    @test "path building using target file based hash"() {

        this.runCodeAndExpectResult("wow", [{
            code: `import {C} from "./test";`,
            expected: [
                "local __FILE_META = {...}",
                "local C = __library.get(\"test/index\").C"
            ]
        }, {
            code: `import {D as Q} from "./test/test2";`,
            expected: [
                "local __FILE_META = {...}",
                "local Q = __library.get(\"test/test2/index\").D"
            ]
        }, {
            code: `import {D} from "@wartoshika/test/test2";`,
            expected: [
                "local __FILE_META = {...}",
                "local D = __library.get(\"node_modules/@wartoshika/test/test2/index\").D"
            ]
        }, {
            code: `import {D} from "@wartoshika/test/test2/../test2";`,
            expected: [
                "local __FILE_META = {...}",
                "local D = __library.get(\"node_modules/@wartoshika/test/test2/index\").D"
            ]
        }], {
                personalizedLibrary: false
            })
    }
}