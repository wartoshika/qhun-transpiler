import { Test } from "./Test";
import { expect } from "chai";
import { Transpiler } from "../src/transpiler/Transpiler";

export declare type TestCodeAndResult = {
    code: string,
    expected: string[],
    message?: string
}[]

export abstract class UnitTest extends Test {

    private transpiler: Transpiler;

    public before(): void {
        this.transpiler = this.getTranspiler("lua");
    }

    protected runCodeAndExpectResult(test: TestCodeAndResult): void {

        test.forEach(oneCase => {

            expect(this.transpile(this.transpiler, oneCase.code))
                .to.deep.equal(oneCase.expected, oneCase.message);
        });
    }
}
