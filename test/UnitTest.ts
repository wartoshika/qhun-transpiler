import { Test } from "./Test";
import { expect } from "chai";
import { SupportedTargets } from "../src/target/TargetFactory";
import { UnsupportedError } from "../src/error/UnsupportedError";

export declare type TestCodeAndResult = {
    code: string,
    expected: string[],
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
    throw: typeof UnsupportedError | typeof Error,
    message?: string
}[];

export abstract class UnitTest extends Test {

    protected runCodeAndExpectResult(target: keyof SupportedTargets, test: TestCodeAndResult): void {

        test.forEach(oneCase => {

            expect(this.transpile(target, oneCase.code))
                .to.deep.equal(oneCase.expected, oneCase.message);

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

    protected runCodeAndExpectResultContains(target: keyof SupportedTargets, test: TestCodeAndResult): void {

        test.forEach(oneCase => {

            expect(this.transpile(target, oneCase.code))
                .to.satisfy((arr: string[]) => {

                    // trim
                    arr = arr.map(line => line.trim());
                    return oneCase.expected.every(line => {
                        const res = arr.indexOf(line) !== -1;
                        if (!res) {
                            console.error("Cannot find", line, "in", arr);
                        }
                        return res;
                    });
                }, oneCase.message);
        });
    }

    protected runCodeAndExpectThrow(target: keyof SupportedTargets, test: TestCodeAndThrow): void {

        test.forEach(oneCase => {

            try {
                expect(this.transpile(target, oneCase.code));
                expect(false).to.equal(true, "no throw statement occured");
            } catch (e) {
                expect(e).to.be.an.instanceof(oneCase.throw, oneCase.message);
            }
        });
    }
}
