import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";


@suite("[Unit] Target: Wow | Path building", slow(1000), timeout(10000)) class WowPathBuilderTest extends UnitTest {

    @test "path building using target file based hash"() {

        this.runCodeAndExpectResult("wow", [{
            code: `import {C} from "./test";`,
            expected: [
                "local __FILE_META = {...}",
                "local C = __library.get(\"9606327c7552bfbe0677bea77d8ae226\").C"
            ]
        }, {
            code: `import {D as Q} from "./test/test2";`,
            expected: [
                "local __FILE_META = {...}",
                "local Q = __library.get(\"3dea18d42ca0a7008917a4f0c97930fa\").D"
            ]
        }, {
            code: `import {D} from "@wartoshika/test/test2";`,
            expected: [
                "local __FILE_META = {...}",
                "local D = __library.get(\"128b6ada17ddc50f2da51e32a5854e3a\").D"
            ]
        }, {
            code: `import {D} from "@wartoshika/test/test2/../test2";`,
            expected: [
                "local __FILE_META = {...}",
                "local D = __library.get(\"128b6ada17ddc50f2da51e32a5854e3a\").D"
            ]
        }], {
                personalizedLibrary: false
            })
    }
}