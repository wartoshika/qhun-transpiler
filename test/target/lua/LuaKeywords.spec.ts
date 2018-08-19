import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { LuaKeywords } from "../../../src/target/lua/LuaKeywords";

@suite("[Unit] Target: Lua | Keywords", slow(1000), timeout(10000)) class LuaKeywordsTest extends UnitTest {


    @test "All keywords"() {

        this.runCodeAndExpectResult("lua", [{
            code: `true`,
            expected: [`true`]
        }, {
            code: `false`,
            expected: [`false`]
        }, {
            code: `null`,
            expected: [`nil`]
        }, {
            code: `undefined`,
            expected: [`nil`]
        }, {
            code: `this`,
            expected: [`self`]
        }, {
            code: `super`,
            expected: [`self.${LuaKeywords.CLASS_SUPER_REFERENCE_NAME}`]
        }]);

    }


}