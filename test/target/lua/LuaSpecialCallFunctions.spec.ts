import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";

@suite("[Unit] Target: Lua | Special call functions", slow(1000), timeout(10000)) class LuaSpecialCallFunctions extends UnitTest {


    @test "String.replace(...)"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `"test".replace(a)`,
                expected: [
                    `__string_replace("test", a)`
                ]
            }, {
                code: `const a: string = "test"; a.replace("a", "b")`,
                expected: [
                    `local a = "test"`,
                    `__string_replace(a, "a", "b")`
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
                    `__array_join({1, 2}, ",")`
                ]
            }, {
                code: `const a: any[] = [1,2]; a.join("|")`,
                expected: [
                    `local a = {1, 2}`,
                    `__array_join(a, "|")`
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
                    `__array_push(a, 1, 2, 3, 4)`
                ]
            }
        ]);
    }

    @test "Array.forEach(...)"() {
        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    [1,2].forEach((value, key) => {
                        run(test);
                    });
                `,
                expected: [
                    `__array_foreach({1, 2}, function (value, key)`,
                    `  run(test)`,
                    `end)`
                ]
            }
        ]);
    }

    @test "Array.map(...)"() {
        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    [1,2].map(num=>{
                        return "test" + num
                    });
                `,
                expected: [
                    `__array_map({1, 2}, function (num)`,
                    `  return "test" .. num`,
                    `end)`
                ]
            }
        ]);
    }

    @test "Array.filter(...)"() {
        this.runCodeAndExpectResult("lua", [
            {
                code: `
                    [1,2,3].filter(obj => {
                        return obj >= 2;
                    });
                `,
                expected: [
                    `__array_filter({1, 2, 3}, function (obj)`,
                    `  return obj >= 2`,
                    `end)`
                ]
            }, {
                code: `
                    [1,2,3].filter(obj => obj >= 2);
                `,
                expected: [
                    `__array_filter({1, 2, 3}, function (obj)`,
                    `  return obj >= 2`,
                    `end)`
                ]
            }
        ]);
    }

    @test "Object.keys()"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `const a = Object.keys(b)`,
                expected: [
                    `local a = __object_keys(b)`
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