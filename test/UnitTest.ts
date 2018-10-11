import { Test } from "./Test";
import { expect } from "chai";
import { SupportedTargets, SupportedTargetConfig } from "../src/target/TargetFactory";
import { UnsupportedError } from "../src/error/UnsupportedError";
import { LuaReservedKeywordError } from "../src/error/lua/LuaReservedKeywordError";

export declare type TestCodeAndResult = {
    code: string,
    expected: string[] | ((context: UnitTest) => string[]),
    /**
     * a stack of named declarations
     */
    expectedAditionalDeclaration?: string[],
    message?: string
}[];

export declare type TestCodeAndContainResult = {
    code: string,
    expected: string,
    message?: string
}[];

export declare type TestCodeAndThrow = {
    code: string,
    throw: typeof LuaReservedKeywordError | typeof UnsupportedError | typeof Error,
    message?: string
}[];

export abstract class UnitTest extends Test {

    protected runCodeAndExpectResult<K extends keyof SupportedTargets>(target: K, test: TestCodeAndResult, config?: Partial<SupportedTargetConfig[K]>): void {

        test.forEach(oneCase => {

            let expected: string[];
            if (typeof oneCase.expected === "function") {
                expected = oneCase.expected(this);
            } else {
                expected = oneCase.expected;
            }

            expect(this.transpile(target, oneCase.code, config))
                .to.deep.equal(expected, oneCase.message);

            if (oneCase.expectedAditionalDeclaration && oneCase.expectedAditionalDeclaration.length > 0) {
                const declarations = Object.keys((this.lastTarget as any).declarationStack);
                expect(declarations).to.satisfy((dec: string[]) => {
                    return oneCase.expectedAditionalDeclaration.every(declaration => {
                        const res = declarations.indexOf(declaration) !== -1;
                        if (!res) {
                            console.error("Cannot find", declaration, "in", declarations);
                        }
                        return res;
                    });
                }, oneCase.message);
            }
        });
    }

    protected runCodeAndExpectResultContains<K extends keyof SupportedTargets>(target: K, test: TestCodeAndResult, config?: SupportedTargetConfig[K]): void {

        test.forEach(oneCase => {

            expect(this.transpile(target, oneCase.code, config))
                .to.satisfy((arr: string[]) => {

                    let expected: string[];
                    if (typeof oneCase.expected === "function") {
                        expected = oneCase.expected(this);
                    } else {
                        expected = oneCase.expected;
                    }

                    // trim
                    arr = arr.map(line => line.trim());
                    return expected.every(line => {
                        const res = arr.indexOf(line) !== -1;
                        if (!res) {
                            console.error("Cannot find", line, "in", arr);
                        }
                        return res;
                    });
                }, oneCase.message);
        });
    }

    protected runCodeAndExpectThrow<K extends keyof SupportedTargets>(target: K, test: TestCodeAndThrow, config?: SupportedTargetConfig[K]): void {

        test.forEach(oneCase => {

            try {
                expect(this.transpile(target, oneCase.code, config));
                expect(false).to.equal(true, "no throw statement occured");
            } catch (e) {
                expect(e).to.be.an.instanceof(oneCase.throw, oneCase.message);
            }
        });
    }
}
