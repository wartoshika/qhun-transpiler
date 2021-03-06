import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";
import { LuaSystemTestBase } from "./LuaSystemTestBase";

@suite("[System] Lua -> Classes", slow(500), timeout(3000)) class LuaSystemClass extends LuaSystemTestBase {

    @test "Simple test"() {

        const testString = "Hello World";

        const res = this.getLuaParseResult(`return "${testString}"`);
        expect(res).to.deep.equal([testString]);
    }

    @test "Class test"() {

        const tsCode = `
            class MyClass {

                constructor(private test: string) {}
                public getTest(): string {
                    return this.test + "!";
                }
            }
        
            return new MyClass("hello lua").getTest();
        `;

        expect(this.getLuaParseResult(tsCode)).to.deep.equal(["hello lua!"]);
    }

    @test "Extended class test"() {

        const tsCode = `
            abstract class MyBase implements IsCool {

                protected baseVar: string = "hasInit";

                constructor(
                    public numericValue: number
                ) {
                    this.numericValue *= 2;
                }

                public isCool(): boolean {

                    return true;
                }
            }

            class MyChild extends MyBase {

                constructor() {
                    super(2);

                    this.numericValue *= 2;
                }

                public getVars(): [string, number] {

                    return [this.baseVar, this.getNumericValue()];
                }

                private getNumericValue(): number {
                    if(this.isCool()) {
                        return this.numericValue;
                    }
                }

            }

            return new MyChild().getVars()
        `;

        expect(this.getLuaParseResult(tsCode)).to.deep.equal([
            "hasInit", 8
        ]);
    }

    @test "Switch case / Enum"() {

        const tsCode = `
            enum TEST {
                A, B, C, D
            }

            const test = (val: TEST) => {
                let retVal: any = "";
                switch(val) {
                    case TEST.A:
                        retVal = "a";
                        break;
                    case TEST.B:
                        retVal = "b";
                        break;
                    default:
                        retVal = "unknown";
                        break;
                }
                return retVal;
            };

            return [test(TEST.A), test(TEST.D)];
        `;

        expect(this.getLuaParseResult(tsCode)).to.deep.equal([
            "a", "unknown"
        ]);
    }

    @test "bitops"() {

        const tsCode = `
            return [
                // AND
                0 & 5,
                1 & 5,
                2 & 5,
                4 & 5,
                8 & 5,

                // OR
                0 | 5,
                1 | 5,
                2 | 5,
                4 | 5,
                8 | 5,

                // XOR
                0 ^ 5,
                1 ^ 5,
                2 ^ 5,
                4 ^ 5,
                8 ^ 5,

                // NOT
                ~0,
                ~1
            ]
        `;
        expect(this.getLuaParseResult(tsCode)).to.deep.equal([
            // AND
            0, 1, 0, 4, 0,
            // OR
            5, 5, 7, 5, 13,
            // XOR
            5, 4, 7, 1, 13,
            // NOT
            1, 0
        ]);
    }

    @test "function.bind(...)"() {

        const tsCode = `
            const a = (val: number)=>{
                return val;
            }
            const b = a.bind(12);

            const c = (a:number,b:number) => {
                return a+b;
            }
            const d = c.bind(1, 2);

            const e = (a: number, b: number) => {
                return a+b;
            }
            const f = e.bind(1);

            return [b(), d(), f(3)]
        `;

        expect(this.getLuaParseResult(tsCode)).to.deep.equal([
            12, 3, 4
        ]);
    }

    @test "Class expression test"() {

        const tsCode = `
            const expressionFunction = (ctor: Function)=>{
                return class extends ctor {
                    public test(): string {
                        return "test worked";
                    }
                }
            }

            class BaseClass {
                public baseTest(): string {
                    return "base test worked";
                }
            }

            const instantiableConstructor = expressionFunction(BaseClass);

            const instance = new instantiableConstructor();
            return [instance.baseTest(), instance.test()];
        `;

        expect(this.getLuaParseResult(tsCode)).to.deep.equal([
            "base test worked", "test worked"
        ]);
    }

    @test "Class decorator test"() {

        const tsCode = `
            const ClassDecorator = <T extends Function>(target: T) => {
                return class ClassDecoratorImpl extends target {
                    constructor(...args: any[]) {
                        this.test = () => {
                            return "test";
                        };
                        super(...args);
                    }
                };
            };

            @ClassDecorator
            class TestClass {

                public otherTest(): string {
                    return "otherTest";
                }
            }

            const instance = new TestClass();
            return [instance.test(), instance.otherTest()];
        `;

        expect(this.getLuaParseResult(tsCode)).to.deep.equal([
            "test", "otherTest"
        ]);
    }
}