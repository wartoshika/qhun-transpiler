import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Parameter decorator", slow(1000), timeout(10000)) class LuaParameterDecorator extends UnitTest {


    @test "Simple class method parameter decorator"() {

        this.runCodeAndExpectResult("lua", [{
            code: `
                class a {

                    public static b(@Test arg1: string, @Test("c") arg2: number): void {

                    }
                }

                a.b();
            `,
            expected: [
                 "local a = {}",
                 "a.__index = a",
                 "function a.__new(self, ...)",
                 "  local instance = setmetatable({}, a)",
                 "  if self and a.__init then",
                 "    a.__init(instance, ...)",
                 "  end",
                 "  return instance",
                 "end",
                 "function a.__init(self)",
                 "end",
                 "function a.b(self, arg1, arg2)",
                 "  arg1 = Test(self, \"b\", 0)",
                 "  arg2 = Test(\"c\")(self, \"b\", 1)",
                 "end",
                 "a:b()"
            ]
        }])
    }
}