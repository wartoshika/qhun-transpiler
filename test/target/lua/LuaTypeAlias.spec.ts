import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Type alias", slow(1000), timeout(10000)) class LuaTypeAlias extends UnitTest {


    @test "A type alias must be skiped"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                   declare type a = boolean;
                `,
                expected: []
            }
        ]);

    }

}