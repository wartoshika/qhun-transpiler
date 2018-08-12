import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Typeof", slow(1000), timeout(10000)) class LuaTypeof extends UnitTest {


    @test "Typeof test"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: "const a = typeof b",
                expected: [
                    `local a = type(b)`
                ]
            }, {
                code: `if(typeof "a" === "string") {
                    run(1);
                }`,
                expected: [
                    `if type("a") == "string" then`,
                    `  run(1)`,
                    `end`
                ]
            }
        ]);

    }

}