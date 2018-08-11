import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Template strings", slow(1000), timeout(10000)) class LuaTemplateString extends UnitTest {


    @test "Simple string with and without variables"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: "`my simple text`",
                expected: [`"my simple text"`]
            }, {
                code: "`string ${_with_} variables`",
                expected: [`"string " .. tostring(_with_) .. " variables"`]
            }, {
                code: "`string that end with a ${_variable_}`",
                expected: [`"string that end with a " .. tostring(_variable_) .. ""`]
            }
        ]);

    }

}