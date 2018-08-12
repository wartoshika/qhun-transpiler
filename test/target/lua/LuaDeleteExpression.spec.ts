import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Delete expressions", slow(1000), timeout(10000)) class LuaDeleteExpression extends UnitTest {


    @test "Simple delete"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `delete obj["test"]`,
                expected: [
                    `obj["test"] = nil`
                ]
            }, {
                code: `delete obj.t["test" + myFunc()]`,
                expected: [
                    `obj.t["test" .. myFunc()] = nil`
                ]
            }, {
                code: `delete obj;`,
                expected: [
                    `obj = nil`
                ]
            }
        ]);

    }

}