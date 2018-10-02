import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Array binding pattern (array destructing assignments)", slow(1000), timeout(10000)) class LuaArrayBindingPattern extends UnitTest {


    @test "Simple destructing"() {

        this.runCodeAndExpectResult("lua", [{
            code: `
                const [a,b] = [1,2];
            `,
            expected: [
                "local a, b = 1, 2"
            ]
        }]);
    }

    @test "Destructing with dotdotdot token"() {
        this.runCodeAndExpectResult("lua", [{
            code: `
                const [a,b,...c] = [1,2,3,4,5,6,7];
            `,
            expected: [
                "local __arrayDestructingAssignment_0 = {1, 2, 3, 4, 5, 6, 7}",
                "local a = __arrayDestructingAssignment_0[1]",
                "local b = __arrayDestructingAssignment_0[2]",
                "local c = {}",
                "for k,v in pairs(__arrayDestructingAssignment_0) do",
                "  if k > 2 then",
                "    table.insert(c, v)",
                "  end",
                "end"
            ]
        }])
    }

    @test "Destructing with right side function"() {
        this.runCodeAndExpectResult("lua", [{
            code: `
                const [a,b,,c] = test();
            `,
            expected: [
                "local a, b, _, c = test()"
            ]
        }])
    }

    @test "Destructing with right side function and dotdotdot token"() {
        this.runCodeAndExpectResult("lua", [{
            code: `
                const [a,b,...c] = test();
            `,
            expected: [
                "local __arrayDestructingAssignment_0 = {test()}",
                "local a = __arrayDestructingAssignment_0[1]",
                "local b = __arrayDestructingAssignment_0[2]",
                "local c = {}",
                "for k,v in pairs(__arrayDestructingAssignment_0) do",
                "  if k > 2 then",
                "    table.insert(c, v)",
                "  end",
                "end"
            ]
        }])
    }
}