import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { StaticReflection } from "../../../src/config/StaticReflection";

@suite("[Unit] Target: Lua | Static reflection", slow(1000), timeout(10000)) class LuaStaticReflection extends UnitTest {


    @test "class reflection complete"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                class Other {}
                class A {
                    constructor(a: string, b: Other) {}
                }`,
                expected: [
                    "local Other = {}",
                    "Other.__index = Other",
                    "Other.__name = \"Other\"",
                    "Other.__namespace = \"test.ts\"",
                    "function Other.__new(self, ...)",
                    "  local instance = setmetatable({}, Other)",
                    "  if self and Other.__prepareNonStatic then",
                    "    Other.__prepareNonStatic(instance)",
                    "  end",
                    "  if self and Other.__init then",
                    "    Other.__init(instance, ...)",
                    "  end",
                    "  return instance",
                    "end",
                    "Other.__staticReflection = {",
                    "  constructor = {",
                    "    ",
                    "  }",
                    "}",
                    "function Other.__init(self)",
                    "end",
                    "local A = {}",
                    "A.__index = A",
                    "A.__name = \"A\"",
                    "A.__namespace = \"test.ts\"",
                    "function A.__new(self, ...)",
                    "  local instance = setmetatable({}, A)",
                    "  if self and A.__prepareNonStatic then",
                    "    A.__prepareNonStatic(instance)",
                    "  end",
                    "  if self and A.__init then",
                    "    A.__init(instance, ...)",
                    "  end",
                    "  return instance",
                    "end",
                    "A.__staticReflection = {",
                    "  constructor = {",
                    "    \"string\",",
                    "    Other",
                    "  }",
                    "}",
                    "function A.__init(self, a, b)",
                    "end"
                ]
            }
        ], {
                staticReflection: StaticReflection.CLASS_NAMESPACE + StaticReflection.CLASS_CONSTRUCTOR + StaticReflection.CLASS_NAME
            });

    }
}
