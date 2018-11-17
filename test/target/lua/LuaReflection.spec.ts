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

    @test "class expression reflection"() {

        this.runCodeAndExpectResult("lua", [{
            code: `
                const a = class {
                    constructor(a: string, b: void) {}
                }
            `,
            expected: [
                "local a = (function () ",
                "  local __classExpression_0 = {}",
                "  __classExpression_0.__index = __classExpression_0",
                "  __classExpression_0.__name = \"__classExpression_0\"",
                "  __classExpression_0.__namespace = \"\"",
                "  function __classExpression_0.__new(self, ...)",
                "    local instance = setmetatable({}, __classExpression_0)",
                "    if self and __classExpression_0.__prepareNonStatic then",
                "      __classExpression_0.__prepareNonStatic(instance)",
                "    end",
                "    if self and __classExpression_0.__init then",
                "      __classExpression_0.__init(instance, ...)",
                "    end",
                "    return instance",
                "  end",
                "  __classExpression_0.__staticReflection = {",
                "    constructor = {",
                "      \"string\",",
                "      \"void\"",
                "    }",
                "  }",
                "  function __classExpression_0.__init(self, a, b)",
                "  end",
                "  return __classExpression_0",
                "end)()"
            ]
        }], {
                staticReflection: StaticReflection.CLASS_CONSTRUCTOR + StaticReflection.CLASS_NAME + StaticReflection.CLASS_NAMESPACE
            });
    }
}