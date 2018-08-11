import { Test } from "./Test";
import { expect } from "chai";
import { SupportedTargets } from "../src/target/TargetFactory";
import { UnsupportedError } from "../src/error/UnsupportedError";

export declare type TestCodeAndResult = {
    code: string,
    expected: string[],
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
