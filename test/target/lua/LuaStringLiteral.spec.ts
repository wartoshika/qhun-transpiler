import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { UnsupportedError } from "../../../src/error/UnsupportedError";

@suite("[Unit] Target: Lua | String literals", slow(1000), timeout(10000)) class LuaStringLiterals extends UnitTest {


    @test "Normal string literals"() {

        this.runCodeAndExpectResult("lua", [{
            code: `"test"`,
            expected: [`"test"`]
        }]);
    }

    @test "Special chars in string literals"() {

        this.runCodeAndExpectResult("lua", [{
            code: `"a string with a \\n line break"`,
            expected: [`"a string with a \\n line break"`]
        }]);
    }

}