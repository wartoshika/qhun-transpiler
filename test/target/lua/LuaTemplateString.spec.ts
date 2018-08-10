import { suite, test } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua") class LuaTemplateString extends UnitTest {


    @test "Template strings"() {

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