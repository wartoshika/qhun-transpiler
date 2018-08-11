import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { UnsupportedError } from "../../../src/error/UnsupportedError";

@suite("[Unit] Target: Lua | Switch", slow(1000), timeout(10000)) class LuaSwitch extends UnitTest {


    @test "Simple switch statement"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    switch(a) {
                        case 1: run(1); break;
                        case 2: run(2); break;
                    }
                `,
                expected: [
                    `local __switch = {`,
                    `  [1] = function()`,
                    `    run(1)`,
                    `  end,`,
                    `  [2] = function()`,
                    `    run(2)`,
                    `  end`,
                    `}`,
                    `if type(__switch[a]) == "function" then`,
                    `  __switch[a]()`,
                    `end`
                ]
            }
        ]);

    }

    @test "With default case"() {
        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    switch(a) {
                        case 1: run(1); break;
                        case 2: run(2); break;
                        default:
                            run("default");
                            break;
                    }
                `,
                expected: [
                    `local __switch = {`,
                    `  [1] = function()`,
                    `    run(1)`,
                    `  end,`,
                    `  [2] = function()`,
                    `    run(2)`,
                    `  end`,
                    `}`,
                    `if type(__switch[a]) == "function" then`,
                    `  __switch[a]()`,
                    `else`,
                    `  run("default")`,
                    `end`
                ]
            }
        ]);
    }

    @test "Unsupported switch cases"() {

        this.runCodeAndExpectThrow("lua", [
            {
                code: `
                    switch(1) {
                        case 1:
                            run(1);
                            return true;
                        case 2: break;
                    }
                `,
                throw: UnsupportedError
            }
        ])
    }

}