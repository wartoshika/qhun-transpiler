import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { UnsupportedError } from "../../../src/error/UnsupportedError";

@suite("[Unit] Target: Lua | Special call functions", slow(1000), timeout(10000)) class LuaSpecialCallFunctions extends UnitTest {


    @test "String.replace(...)"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `"test".replace(a)`,
                expected: [
                    `__string_replace("test", a)`
                ],
                expectedAditionalDeclaration: [
                    'string.replace'
                ]
            }, {
                code: `const a: string = "test"; a.replace("a", "b")`,
                expected: [
                    `local a = "test"`,
                    `__string_replace(a, "a", "b")`
                ],
                expectedAditionalDeclaration: [
                    'string.replace'
                ]
            }, {
                code: `myObj.replace(1,2,3)`,
                expected: [
                    `myObj:replace(1, 2, 3)`
                ]
            }
        ]);

    }

    @test "String.split(...)"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `"test".split(".")`,
                expected: [
                    `__string_split("test", ".")`
                ],
                expectedAditionalDeclaration: [
                    'string.split'
                ]
            }, {
                code: `const a: string = "test"; a.split("|")`,
                expected: [
                    `local a = "test"`,
                    `__string_split(a, "|")`
                ],
                expectedAditionalDeclaration: [
                    'string.split'
                ]
            }, {
                code: `myObj.split(1,2,3)`,
                expected: [
                    `myObj:split(1, 2, 3)`
                ]
            }
        ]);

    }

    @test "String.substr(...)"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `"test".substr(1,2)`,
                expected: [
                    `__string_substr("test", 1, 2)`
                ],
                expectedAditionalDeclaration: [
                    'string.substr'
                ]
            }
        ]);

    }

    @test "String.trim(...)"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `"test".trim()`,
                expected: [
                    `__string_trim("test")`
                ],
                expectedAditionalDeclaration: [
                    'string.trim'
                ]
            }
        ]);

    }

    @test "String.charAt(...)"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `"test".charAt(0)`,
                expected: [
                    `__string_char_at("test", 0)`
                ],
                expectedAditionalDeclaration: [
                    'string.charat'
                ]
            }
        ]);

    }

    @test "String.toLowerCase(...)"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `"test".toLowerCase()`,
                expected: [
                    `__string_lower("test")`
                ],
                expectedAditionalDeclaration: [
                    'string.lower'
                ]
            }
        ]);

    }

    @test "String.toUpperCase(...)"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `"test".toUpperCase()`,
                expected: [
                    `__string_upper("test")`
                ],
                expectedAditionalDeclaration: [
                    'string.upper'
                ]
            }
        ]);

    }

    @test "String.match(...)"() {

        const regexp = /\s/;

        this.runCodeAndExpectResult("lua", [
            {
                code: `"test".match(${regexp.toString()})`,
                expected: [
                    `__string_match("test", "%s")`
                ],
                expectedAditionalDeclaration: [
                    'string.match'
                ]
            }
        ]);

        const regexpUnsupported = /\D/;

        this.runCodeAndExpectThrow("lua", [{
            code: `"test".match(${regexpUnsupported.toString()})`,
            throw: UnsupportedError
        }])

    }

    @test "Array.join(...)"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `[1,2].join(",")`,
                expected: [
                    `__array_join({1, 2}, ",")`
                ],
                expectedAditionalDeclaration: [
                    'array.join'
                ]
            }, {
                code: `const a: any[] = [1,2]; a.join("|")`,
                expected: [
                    `local a = {1, 2}`,
                    `__array_join(a, "|")`
                ],
                expectedAditionalDeclaration: [
                    'array.join'
                ]
            }, {
                code: `myObj.join(",")`,
                expected: [
                    `myObj:join(",")`
                ]
            }
        ]);

    }

    @test "Array.push(...)"() {
        this.runCodeAndExpectResult("lua", [
            {
                code: `[8,9].push(1,2,3,4);`,
                expected: [
                    `__array_push({8, 9}, 1, 2, 3, 4)`
                ],
                expectedAditionalDeclaration: [
                    'array.push'
                ]
            }, {
                code: `const a: any[] = []; a.push(1,2,3,4);`,
                expected: [
                    `local a = {}`,
                    `__array_push(a, 1, 2, 3, 4)`
                ],
                expectedAditionalDeclaration: [
                    'array.push'
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
                ],
                expectedAditionalDeclaration: [
                    'array.foreach'
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
                ],
                expectedAditionalDeclaration: [
                    'array.map'
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
                ],
                expectedAditionalDeclaration: [
                    'array.filter'
                ]
            }, {
                code: `
                    [1,2,3].filter(obj => obj >= 2);
                `,
                expected: [
                    `__array_filter({1, 2, 3}, function (obj)`,
                    `  return obj >= 2`,
                    `end)`
                ],
                expectedAditionalDeclaration: [
                    'array.filter'
                ]
            }, {
                code: `[1,2].filter(myFilterFunc)`,
                expected: [
                    `__array_filter({1, 2}, myFilterFunc)`
                ],
                expectedAditionalDeclaration: [
                    'array.filter'
                ]
            }, {
                code: `[1,2].filter(obj => !!obj)`,
                expected: [
                    `__array_filter({1, 2}, function (obj)`,
                    `  return (not (not obj))`,
                    `end)`
                ],
                expectedAditionalDeclaration: [
                    'array.filter'
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
                ],
                expectedAditionalDeclaration: [
                    'object.keys'
                ]
            }, {
                code: `myObj.keys()`,
                expected: [
                    `myObj:keys()`
                ]
            }
        ]);
    }

    @test "Object.values()"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `const a = Object.values(b)`,
                expected: [
                    `local a = __object_values(b)`
                ],
                expectedAditionalDeclaration: [
                    'object.values'
                ]
            }, {
                code: `myObj.values()`,
                expected: [
                    `myObj:values()`
                ]
            }
        ]);
    }

    @test "Object.hasOwnProperty()"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `const a: {} = {}; a.hasOwnProperty("b")`,
                expected: [
                    `local a = {}`,
                    `__object_hasownproperty(a, "b")`
                ],
                expectedAditionalDeclaration: [
                    'object.hasownproperty'
                ]
            }, {
                code: `myUntypedObject.hasOwnProperty("b")`,
                expected: [
                    `myUntypedObject:hasOwnProperty("b")`
                ]
            }
        ]);

        this.runCodeAndExpectThrow("lua", [{
            code: `Object.hasOwnProperty("b")`,
            throw: UnsupportedError
        }])
    }

    @test "Unsupported Object.* test"() {
        this.runCodeAndExpectThrow("lua", [{
            code: `Object.unsupported()`,
            throw: UnsupportedError
        }])
    }

    @test "Math functions"() {

        this.runCodeAndExpectResult("lua", [
            {
                code: `console.log(Math.atan(2));`,
                expected: [
                    `console:log(math.atan(2))`
                ]
            }
        ]);

        this.runCodeAndExpectThrow("lua", [
            {
                code: `console.log(Math.atan2(1,2))`,
                throw: UnsupportedError
            }
        ])
    }

}