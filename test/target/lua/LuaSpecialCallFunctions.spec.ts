import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Special call functions", slow(1000), timeout(10000)) class LuaSpecialCallFunctions extends UnitTest {


    @test "String.replace(...)"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `"test".replace(a)`,
                expected: [
                    `(function(___a,___b,___c) return String.gsub("test", ___a, ___b, ___c) end)(a)`
                ]
            }, {
                code: `const a: string = "test"; a.replace("a", "b")`,
                expected: [
                    `local a = "test"`,
                    `(function(___a,___b,___c) return String.gsub(a, ___a, ___b, ___c) end)("a", "b")`
                ]
            }, {
                code: `myObj.replace(1,2,3)`,
                expected: [
                    `myObj.replace(1, 2, 3)`
                ]
            }
        ]);

    }

    @test "Array.join(...)"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `[1,2].join(",")`,
                expected: [
                    `(function(___a) return table.concat({1, 2}, ___a) end)(",")`
                ]
            }, {
                code: `const a: any[] = [1,2]; a.join("|")`,
                expected: [
                    `local a = {1, 2}`,
                    `(function(___a) return table.concat(a, ___a) end)("|")`
                ]
            }, {
                code: `myObj.join(",")`,
                expected: [
                    `myObj.join(",")`
                ]
            }
        ]);

    }

    @test "Array.push(...)"() {
        this.runCodeAndExpectResult("lua", [
            {
                code: `const a: any[] = []; a.push(1,2,3,4);`,
                expected: [
                    `local a = {}`,
                    `(function(...) local ___v = {...} for _, ___e in pairs(___v) do table.insert(a, ___e) end end)(1, 2, 3, 4)`
                ]
            }
        ]);
    }

    @test "Object.keys()"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `const a = Object.keys(a)`,
                expected: [
                    `local a = (function(___a) local keys = {} for k, _ in pairs(___a) do table.insert(keys, k) end return keys end)(a)`
                ]
            }, {
                code: `myObj.keys()`,
                expected: [
                    `myObj.keys()`
                ]
            }
        ]);
    }

}