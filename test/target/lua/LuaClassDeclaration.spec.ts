import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { LuaKeywords } from "../../../src/target/lua/LuaKeywords";

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
                    `function A.${LuaKeywords.CLASS_NEW_FUNCTION_NAME}(self, ...)`,
                    `  local instance = setmetatable({}, A)`,
                    `  if self and A.${LuaKeywords.CLASS_INIT_FUNCTION_NAME} then`,
                    `    A.${LuaKeywords.CLASS_INIT_FUNCTION_NAME}(instance, ...)`,
                    `  end`,
                    `  return instance`,
                    `end`,
                    `function A.${LuaKeywords.CLASS_INIT_FUNCTION_NAME}(self)`,
                    `end`
                ]
            }
        ]);

    }

}