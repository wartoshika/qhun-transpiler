import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Class expressions", slow(1000), timeout(10000)) class LuaExpressions extends UnitTest {


    @test "Simple expression without inheritance"() {

        this.runCodeAndExpectResult("lua", [{
            code: `
            const test = (ctor: Function) => {
                return class Test {
                    public test(): void {}
                }
            }
            `,
            expected: [
                "local test = function (ctor)",
                "  return (function () ",
                "    local Test = {}",
                "    Test.__index = Test",
                "    function Test.__new(self, ...)",
                "      local instance = setmetatable({}, Test)",
                "      if self and Test.__prepareNonStatic then",
                "        Test.__prepareNonStatic(instance)",
                "      end",
                "      if self and Test.__init then",
                "        Test.__init(instance, ...)",
                "      end",
                "      return instance",
                "    end",
                "    function Test.__init(self)",
                "    end",
                "    function Test.test(self)",
                "    end",
                "    return Test",
                "  end)()",
                "end"
            ]
        }]);
    }

    @test "Class expression without class name"() {

        this.runCodeAndExpectResult("lua", [{
            code: `
            const test = (ctor: Function) => {
                return class {
                    public test(): void {}
                }
            }
            `,
            expected: [
                "local test = function (ctor)",
                "  return (function () ",
                "    local __classExpression_0 = {}",
                "    __classExpression_0.__index = __classExpression_0",
                "    function __classExpression_0.__new(self, ...)",
                "      local instance = setmetatable({}, __classExpression_0)",
                "      if self and __classExpression_0.__prepareNonStatic then",
                "        __classExpression_0.__prepareNonStatic(instance)",
                "      end",
                "      if self and __classExpression_0.__init then",
                "        __classExpression_0.__init(instance, ...)",
                "      end",
                "      return instance",
                "    end",
                "    function __classExpression_0.__init(self)",
                "    end",
                "    function __classExpression_0.test(self)",
                "    end",
                "    return __classExpression_0",
                "  end)()",
                "end"
            ]
        }]);
    }

    @test "Class expression heritage"() {

        this.runCodeAndExpectResult("lua", [{
            code: `
            const test = (ctor: Function) => {
                return class extends ctor {
                    public test(): void {}
                }
            }
            `,
            expected: [
                "local test = function (ctor)",
                "  return (function () ",
                "    local __classExpression_0 = ctor.__new({})",
                "    __classExpression_0.__super = ctor",
                "    __classExpression_0.__index = __classExpression_0",
                "    function __classExpression_0.__new(self, ...)",
                "      local instance = setmetatable({}, __classExpression_0)",
                "      if self and __classExpression_0.__prepareNonStatic then",
                "        __classExpression_0.__prepareNonStatic(instance)",
                "      end",
                "      if self and __classExpression_0.__init then",
                "        __classExpression_0.__init(instance, ...)",
                "      end",
                "      return instance",
                "    end",
                "    function __classExpression_0.test(self)",
                "    end",
                "    return __classExpression_0",
                "  end)()",
                "end"
            ]
        }]);
    }
}