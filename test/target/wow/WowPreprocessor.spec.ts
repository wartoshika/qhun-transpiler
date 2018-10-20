import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { PreProcessorFunction } from "../../../src/compiler/PreProcessor";

@suite("[Unit] Target: Wow | Preprocessor", slow(1000), timeout(10000)) class WowPreprocessor extends UnitTest {


    @test "wow preprocessor require"() {

        this.runCodeAndExpectResult("wow", [
            {
                code: `
                    ${PreProcessorFunction.QHUN_TRANSPILER_REQUIRE}("a/b", "c")
                `,
                expected: [
                    `local __FILE_META = {...}`,
                    `global_require_lib("a/b", "c")`
                ],
                expectedAditionalDeclaration: [
                    "global.require_lib"
                ]
            }
        ]);
    }
}