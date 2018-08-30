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
               // ~3
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
            //-4
        ]);
    }
}