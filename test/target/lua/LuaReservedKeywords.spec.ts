import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { LuaReservedKeywordError } from "../../../src/error/lua/LuaReservedKeywordError";

@suite("[Unit] Target: Lua | Reserved keywords", slow(1000), timeout(10000)) class LuaReservedKeywords extends UnitTest {


    @test "Reserved keyword check"() {

        this.runCodeAndExpectThrow("lua", [{
            code: `const end = "test";`,
            throw: LuaReservedKeywordError
        }, {
            code: `let nil = undefined;`,
            throw: LuaReservedKeywordError
        }]);

    }

    @test "Upper case reserved keyword check"() {
        this.runCodeAndExpectResult("lua", [{
            code: `const END = "test";`,
            expected: [`local END = "test"`]
        }])
    }

}