import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { LuaKeywords } from "../../../src/target/lua/LuaKeywords";
import { UnsupportedError } from "../../../src/error/UnsupportedError";

@suite("[Unit] Target: Lua | Keywords", slow(1000), timeout(10000)) class LuaKeywordsTest extends UnitTest {


    @test "All keywords"() {

        this.runCodeAndExpectResult("lua", [{
            code: `true`,
            expected: [`true`]
        }, {
            code: `false`,
            expected: [`false`]
        }, {
            code: `null`,
            expected: [`nil`]
        }, {
            code: `undefined`,
            expected: [`nil`]
        }, {
            code: `this`,
            expected: [`self`]
        }]);

    }

    @test "Super keyword without class context"() {
        this.runCodeAndExpectThrow("lua", [{
            code: "super",
            throw: UnsupportedError
        }]);
    }

    @test "Super keyword with class context"() {
        this.runCodeAndExpectResult("lua", [{
            code: `
                class A {
                    constructor() {
                        super();
                    }
                }
            `,
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
                "function A.__init(self)",
                "  A.__super.__init(self)",
                "end"

            ]
        }]);
    }


}