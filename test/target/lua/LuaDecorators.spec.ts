import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { LuaKeywords } from "../../../src/target/lua/LuaKeywords";

@suite("[Unit] Target: Lua | Decorators", slow(1000), timeout(10000)) class LuaDecorators extends UnitTest {


    @test "Property level decorators"() {

        this.runCodeAndExpectResultContains("lua", [
            {
                code: `
                    class A {

                        @myDecorator
                        private a: string;
                    }
                `,
                expected: [
                    `myDecorator(${LuaKeywords.CLASS_INSTANCE_LOCAL_NAME}, "a")`
                ]
            }, {
                code: `
                    class A {

                        @first
                        @second
                        @third("testarg")
                        private prop: string;

                        @other
                        public otherProp: any[] = "test";
                    }
                `,
                expected: [
                    `first(${LuaKeywords.CLASS_INSTANCE_LOCAL_NAME}, "prop")`,
                    `second(${LuaKeywords.CLASS_INSTANCE_LOCAL_NAME}, "prop")`,
                    `third("testarg")(${LuaKeywords.CLASS_INSTANCE_LOCAL_NAME}, "prop")`,
                    `other(${LuaKeywords.CLASS_INSTANCE_LOCAL_NAME}, "otherProp")`
                ]
            }
        ]);

    }

}