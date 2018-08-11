import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | If", slow(1000), timeout(10000)) class LuaIfStatement extends UnitTest {


    @test "Simple without else statement"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `if(a && true) { let a = true; }`,
                expected: [
                    `if a and true then`,
                    `  local a = true`,
                    `end`
                ]
            }
        ]);

    }

    @test "If with else statement"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    if(true) {
                        print(1);
                    }else{
                        print(2);
                    }
                `,
                expected: [
                    `if true then`,
                    `  print(1)`,
                    `else`,
                    `  print(2)`,
                    `end`
                ]
            }
        ]);
    }

    @test "Complex neasted if with elseif statement"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    if(true) {
                        if(false) {
                            print(false);
                        }else if(true) {
                            print("3");
                        }else{
                            print("yay");
                        }
                    }else{
                        print(2);
                    }
                `,
                expected: [
                    `if true then`,
                    `  if false then`,
                    `    print(false)`,
                    `  elseif true then`,
                    `    print("3")`,
                    `  else`,
                    `    print("yay")`,
                    `  end`,
                    `else`,
                    `  print(2)`,
                    `end`
                ]
            }
        ]);
    }
}