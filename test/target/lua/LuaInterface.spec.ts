import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Interface", slow(1000), timeout(10000)) class LuaInterface extends UnitTest {


    @test "Interfaces must be skipped"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    interface a {}
                `,
                expected: []
            }, {
                code: `
                    interface a {}
                    const b: a = {}
                `,
                expected: [
                    `local b = {}`
                ]
            }
        ]);

    }


}