import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Class declaration", slow(1000), timeout(10000)) class LuaClassDeclaration extends UnitTest {


    @test "Simple class"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    class A {}
                `,
                expected: [
                    `local A = {}`,
                    `A.__index = A`,
                    `function A.__init(self, ...)`,
                    `  local instance = setmetatable({}, A)`,
                    `  if self and A.__new then`,
                    `    A.__new(instance, ...)`,
                    `  end`,
                    `  return instance`,
                    `end`,
                    `function A.__new(self)`,
                    `end`
                ]
            }
        ]);

    }

}