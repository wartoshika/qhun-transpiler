import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

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
                    `function A.__new(self)`,
                    `end`
                ]
            }
        ]);

    }

    @test "Class with static properties"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    class A {
                        public static a: string;
                        private static b: string = "test";
                    }
                `,
                expected: [
                    `local A = {}`,
                    `A.__index = A`,
                    `A.a = nil`,
                    `A.b = "test"`,
                    `function A.__new(self)`,
                    `end`
                ]
            }
        ]);
    }

    @test "Complex non heritage class structure"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    class MyClass implements B {
                        private a: string;
                        private b: string = {};
                        public c: string;
                        public static d: number = 4;

                        constructor(private a: string, private b: number = 4, ...c?: any[]) {
                            print(a,b,c);
                        }
                    }
                `,
                expected: [
                    `local MyClass = {}`,
                    `MyClass.__index = MyClass`,
                    `MyClass.d = 4`,
                    `function MyClass.__new(self, a, b, ...)`,
                    `  self.a = nil`,
                    `  self.b = {}`,
                    `  self.c = nil`,
                    `  if b == nil then b = 4 end`,
                    `  local c = {...}`,
                    `  self.a = a`,
                    `  self.b = b`,
                    `  print(a, b, c)`,
                    `end`
                ]
            }
        ]);
    }

}