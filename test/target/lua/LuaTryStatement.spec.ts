import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Try statement", slow(1000), timeout(10000)) class LuaTryStatement extends UnitTest {


    @test "Try catch without finally"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    try {
                        run(1);
                    }catch(e) {
                        run(2);
                    }
                `,
                expected: [
                    `xpcall(function()`,
                    `  run(1)`,
                    `end, function(e)`,
                    `  run(2)`,
                    `end)`
                ]
            }
        ]);

    }

    @test "Try catch with finally"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    try {
                        run(1);
                    }catch(d) {
                        run(d);
                    }finally{
                        run(3);
                    }
                `,
                expected: [
                    `xpcall(function()`,
                    `  run(1)`,
                    `end, function(d)`,
                    `  run(d)`,
                    `end)`,
                    `run(3)`
                ]
            }
        ]);
    }

}