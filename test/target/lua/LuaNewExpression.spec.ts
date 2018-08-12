import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { LuaKeywords } from "../../../src/target/lua/LuaKeywords";

@suite("[Unit] Target: Lua | New expression", slow(1000), timeout(10000)) class LuaNewExpression extends UnitTest {


    @test "Simple new statement"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `new MyClass()`,
                expected: [
                    `MyClass.${LuaKeywords.CLASS_NEW_FUNCTION_NAME}(true)`
                ]
            }
        ]);

    }

    @test "New statement with parameter"() {
        this.runCodeAndExpectResult("lua", [
            {
                code: `new MyClass(true, [])`,
                expected: [
                    `MyClass.${LuaKeywords.CLASS_NEW_FUNCTION_NAME}(true, true, {})`
                ]
            }, {
                code: `new MyClass(new MyOtherClass(1))`,
                expected: [
                    `MyClass.${LuaKeywords.CLASS_NEW_FUNCTION_NAME}(true, MyOtherClass.${LuaKeywords.CLASS_NEW_FUNCTION_NAME}(true, 1))`
                ]
            }
        ]);
    }
}