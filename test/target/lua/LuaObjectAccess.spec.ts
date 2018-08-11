import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { UnsupportedError } from "../../../src/error/UnsupportedError";

@suite("[Unit] Target: Lua | Object access", slow(1000), timeout(10000)) class LuaObjectAccess extends UnitTest {


    @test "Simple property access expression"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    const a = {b: true};
                    if(a.b) {
                        a.b = false;
                    }
                `,
                expected: [
                    `local a = {b=true}`,
                    `if a.b then`,
                    `  a.b = false`,
                    `end`
                ]
            }
        ]);

    }

    @test "String.length property"() {
        this.runCodeAndExpectResult("lua", [
            {
                code: `const a: string = "test"; let b = a.length;`,
                expected: [
                    `local a = "test"`,
                    `local b = string.len(a)`
                ]
            }, {
                code: `const a = "test".length;`,
                expected: [
                    `local a = string.len("test")`
                ]
            }, {
                code: `const a = {length: 5}; let b = a.length;`,
                expected: [
                    `local a = {length=5}`,
                    `local b = a.length`
                ]
            }
        ]);
    }

    @test "array.length property"() {
        this.runCodeAndExpectResult("lua", [
            {
                code: `const a: any[] = [1,2]; let b = a.length;`,
                expected: [
                    `local a = {1,2}`,
                    `local b = #a`
                ]
            }, {
                code: `const a = [1,2].length;`,
                expected: [
                    `local a = #{1,2}`
                ]
            }
        ]);
    }

    @test "unsupported magic properties"() {
        this.runCodeAndExpectThrow("lua", [
            {
                code: `const a = "test".unknown;`,
                throw: UnsupportedError
            }, {
                code: `const a = [1,2].unknown;`,
                throw: UnsupportedError
            }
        ]);
    }
}