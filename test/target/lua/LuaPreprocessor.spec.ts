import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { PreProcessorFunction } from "../../../src/compiler/PreProcessor";
import { UnsupportedError } from "../../../src/error/UnsupportedError";

@suite("[Unit] Target: Lua | Preprocessor", slow(1000), timeout(10000)) class LuaPreprocessor extends UnitTest {


    @test "lua preprocessor not supported"() {

        this.runCodeAndExpectThrow("lua", [
            {
                code: `
                ${PreProcessorFunction.QHUN_TRANSPILER_REQUIRE}("", "")
                `,
                throw: UnsupportedError
            }
        ]);
    }
}