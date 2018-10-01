import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { StaticReflection } from "../../../src/config/StaticReflection";

@suite("[Unit] Target: Lua | Static reflection", slow(1000), timeout(10000)) class LuaReflection extends UnitTest {


    @test "class static reflection"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                class A {

                    constructor(a: string, b: Function) {}
                }`,
                expected: [
                    "local A = {}",
                    "A.__index = A",
                    "function A.__new(self, ...)",
                    "  local instance = setmetatable({}, A)",
                    "  if self and A.__init then",
                    "    A.__init(instance, ...)",
                    "  end",
                    "  return instance",
                    "end",
                    "A.__staticReflection = {",
                    "  constructor = {",
                    "    \"string\",",
                    "    nil",
                    "  }",
                    "}",
                    "function A.__init(self, a, b)",
                    "end"
                ]
            }
        ], {
                staticReflection: StaticReflection.CLASS_CONSTRUCTOR
            });
    }
}