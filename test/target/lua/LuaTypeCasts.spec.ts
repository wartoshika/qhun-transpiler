import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Type casts", slow(1000), timeout(10000)) class LuaTypeCasts extends UnitTest {


    @test "Type casts should be ignored"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: "a as b as c",
                expected: [`a`]
            }, {
                code: `(obj as b).b = <T>result;`,
                expected: [`(obj).b = result`]
            }
        ]);

    }

}