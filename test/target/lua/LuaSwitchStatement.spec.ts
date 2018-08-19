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
                    `local __switch_0 = {`,
                    `  [1] = function()`,
                    `    run(1)`,
                    `  end,`,
                    `  [2] = function()`,
                    `    run(2)`,
                    `  end`,
                    `}`,
                    `if type(__switch_0[a]) == "function" then`,
                    `  __switch_0[a]()`,
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
                    `local __switch_0 = {`,
                    `  [1] = function()`,
                    `    run(1)`,
                    `  end,`,
                    `  [2] = function()`,
                    `    run(2)`,
                    `  end`,
                    `}`,
                    `if type(__switch_0[a]) == "function" then`,
                    `  __switch_0[a]()`,
                    `else`,
                    `  run("default")`,
                    `end`
                ]
            }
        ]);
    }

    @test "Switch statements with return in case block"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    switch(1) {
                        case 1:
                            run(1);
                            return true;
                        case 2: 
                            run(2);
                            break;
                        case 3:
                            run(3);
                            break;
                        case 4: break;
                    }
                `,
                expected: [
                    `if 1 == 1 then`,
                    `  run(1)`,
                    `  return true`,
                    `elseif 1 == 2 then`,
                    `  run(2)`,
                    `elseif 1 == 3 then`,
                    `  run(3)`,
                    `elseif 1 == 4 then`,
                    `  `,
                    `end`
                ]
            }, {
                code: `
                    switch(a) {
                        case "test": return hello("test"); break;
                        case "test2": return hello("test2"); break;
                        default:
                            return hello("default");
                            break;
                    }
                `,
                expected: [
                    `if a == "test" then`,
                    `  return hello("test")`,
                    `elseif a == "test2" then`,
                    `  return hello("test2")`,
                    `else`,
                    `  return hello("default")`,
                    `end`
                ]
            }
        ])
    }

}