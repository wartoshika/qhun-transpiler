import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { LuaKeywords } from "../../../src/target/lua/LuaKeywords";

@suite("[Unit] Target: Lua | Class declaration", slow(1000), timeout(10000)) class LuaClassDeclaration extends UnitTest {


    @test "Simple class"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    class A {}
                `,
                expected: [
                    `local A = {}`,
                    `A.__index = A`,
                    `function A.${LuaKeywords.CLASS_NEW_FUNCTION_NAME}(self, ...)`,
                    `  local instance = setmetatable({}, A)`,
                    `  if self and A.${LuaKeywords.CLASS_PREPARE_NON_STATIC} then`,
                    `    A.${LuaKeywords.CLASS_PREPARE_NON_STATIC}(${LuaKeywords.CLASS_INSTANCE_LOCAL_NAME})`,
                    `  end`,
                    `  if self and A.${LuaKeywords.CLASS_INIT_FUNCTION_NAME} then`,
                    `    A.${LuaKeywords.CLASS_INIT_FUNCTION_NAME}(instance, ...)`,
                    `  end`,
                    `  return instance`,
                    `end`,
                    `function A.${LuaKeywords.CLASS_INIT_FUNCTION_NAME}(self)`,
                    `end`
                ]
            }
        ]);

    }

    @test "Simple class heritage"() {
        this.runCodeAndExpectResult("lua", [{
            code: `
                class Base {}
                class Child extends Base {}
            `,
            expected: [
                `local Base = {}`,
                `Base.__index = Base`,
                `function Base.${LuaKeywords.CLASS_NEW_FUNCTION_NAME}(self, ...)`,
                `  local instance = setmetatable({}, Base)`,
                `  if self and Base.${LuaKeywords.CLASS_PREPARE_NON_STATIC} then`,
                `    Base.${LuaKeywords.CLASS_PREPARE_NON_STATIC}(${LuaKeywords.CLASS_INSTANCE_LOCAL_NAME})`,
                `  end`,
                `  if self and Base.${LuaKeywords.CLASS_INIT_FUNCTION_NAME} then`,
                `    Base.${LuaKeywords.CLASS_INIT_FUNCTION_NAME}(instance, ...)`,
                `  end`,
                `  return instance`,
                `end`,
                `function Base.${LuaKeywords.CLASS_INIT_FUNCTION_NAME}(self)`,
                `end`,
                `local Child = Base.${LuaKeywords.CLASS_NEW_FUNCTION_NAME}()`,
                `Child.${LuaKeywords.CLASS_SUPER_REFERENCE_NAME} = Base`,
                `Child.__index = Child`,
                `function Child.${LuaKeywords.CLASS_NEW_FUNCTION_NAME}(self, ...)`,
                `  local instance = setmetatable({}, Child)`,
                `  if self and Child.${LuaKeywords.CLASS_PREPARE_NON_STATIC} then`,
                `    Child.${LuaKeywords.CLASS_PREPARE_NON_STATIC}(${LuaKeywords.CLASS_INSTANCE_LOCAL_NAME})`,
                `  end`,
                `  if self and Child.${LuaKeywords.CLASS_INIT_FUNCTION_NAME} then`,
                `    Child.${LuaKeywords.CLASS_INIT_FUNCTION_NAME}(instance, ...)`,
                `  end`,
                `  return instance`,
                `end`
            ]
        }])
    }

    @test "Class heritage with custom constructor"() {
        this.runCodeAndExpectResult("lua", [{
            code: `
                class Base {
                    constructor(a: string){ }
                }
                class Child extends Base {

                    constructor(
                        private test: string,
                        public b: string
                    ) {
                        super(test + b);
                    }
                }
            `,
            expected: [
                `local Base = {}`,
                `Base.__index = Base`,
                `function Base.${LuaKeywords.CLASS_NEW_FUNCTION_NAME}(self, ...)`,
                `  local instance = setmetatable({}, Base)`,
                `  if self and Base.${LuaKeywords.CLASS_PREPARE_NON_STATIC} then`,
                `    Base.${LuaKeywords.CLASS_PREPARE_NON_STATIC}(${LuaKeywords.CLASS_INSTANCE_LOCAL_NAME})`,
                `  end`,
                `  if self and Base.${LuaKeywords.CLASS_INIT_FUNCTION_NAME} then`,
                `    Base.${LuaKeywords.CLASS_INIT_FUNCTION_NAME}(instance, ...)`,
                `  end`,
                `  return instance`,
                `end`,
                `function Base.${LuaKeywords.CLASS_INIT_FUNCTION_NAME}(self, a)`,
                `end`,
                `local Child = Base.${LuaKeywords.CLASS_NEW_FUNCTION_NAME}()`,
                `Child.${LuaKeywords.CLASS_SUPER_REFERENCE_NAME} = Base`,
                `Child.__index = Child`,
                `function Child.${LuaKeywords.CLASS_NEW_FUNCTION_NAME}(self, ...)`,
                `  local instance = setmetatable({}, Child)`,
                `  if self and Child.${LuaKeywords.CLASS_PREPARE_NON_STATIC} then`,
                `    Child.${LuaKeywords.CLASS_PREPARE_NON_STATIC}(${LuaKeywords.CLASS_INSTANCE_LOCAL_NAME})`,
                `  end`,
                `  if self and Child.${LuaKeywords.CLASS_INIT_FUNCTION_NAME} then`,
                `    Child.${LuaKeywords.CLASS_INIT_FUNCTION_NAME}(instance, ...)`,
                `  end`,
                `  return instance`,
                `end`,
                `function Child.${LuaKeywords.CLASS_INIT_FUNCTION_NAME}(self, test, b)`,
                `  self.test = test`,
                `  self.b = b`,
                `  Child.${LuaKeywords.CLASS_SUPER_REFERENCE_NAME}.${LuaKeywords.CLASS_INIT_FUNCTION_NAME}(self, test .. b)`,
                `end`,
            ]
        }])
    }

    @test "class with non static properties and initializer"() {

        this.runCodeAndExpectResult("lua", [{
            code: `
                class A {

                    protected test: string = "test";
                }

                class B extends A {}

                new B()
            `,
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
                "function A.__prepareNonStatic(self)",
                "  self.test = \"test\"",
                "end",
                "function A.__init(self)",
                "end",
                "local B = A.__new()",
                "B.__super = A",
                "B.__index = B",
                "function B.__new(self, ...)",
                "  local instance = setmetatable({}, B)",
                "  if self and B.__prepareNonStatic then",
                "    B.__prepareNonStatic(instance)",
                "  end",
                "  if self and B.__init then",
                "    B.__init(instance, ...)",
                "  end",
                "  return instance",
                "end",
                "B.__new(true)"

            ]
        }]);
    }

}