import { Test } from "./Test";
import { expect } from "chai";
import { SupportedTargets } from "../src/target/TargetFactory";

export declare type TestCodeAndResult = {
    code: string,
    expected: string[],
    message?: string
}[]

export abstract class UnitTest extends Test {

    protected runCodeAndExpectResult(target: keyof SupportedTargets, test: TestCodeAndResult): void {

        test.forEach(oneCase => {

            expect(this.transpile(target, oneCase.code))
                .to.deep.equal(oneCase.expected, oneCase.message);
        });
    }
}
