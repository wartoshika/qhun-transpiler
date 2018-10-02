import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { LuaKeywords } from "../../../src/target/lua/LuaKeywords";

@suite("[Unit] Target: Lua | Class decorators", slow(1000), timeout(10000)) class LuaClassDecorators extends UnitTest {


    @test "Simple decorator"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                @A
                class B {}
                `,
                expected: [
                    "local B = {}",
                    "B.__index = B",
                    "function B.__new(self, ...)",
                    "  local instance = setmetatable({}, B)",
                    "  if self and B.__init then",
                    "    B.__init(instance, ...)",
                    "  end",
                    "  return instance",
                    "end",
                    "function B.__init(self)",
                    "end",
                    "B = A(B)"
                ]
            }
        ]);
    }

    @test "Decorator factory"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                @A("test")
                class B {}
                `,
                expected: [
                    "local B = {}",
                    "B.__index = B",
                    "function B.__new(self, ...)",
                    "  local instance = setmetatable({}, B)",
                    "  if self and B.__init then",
                    "    B.__init(instance, ...)",
                    "  end",
                    "  return instance",
                    "end",
                    "function B.__init(self)",
                    "end",
                    "B = A(\"test\")(B)"
                ]
            }
        ]);
    }
}