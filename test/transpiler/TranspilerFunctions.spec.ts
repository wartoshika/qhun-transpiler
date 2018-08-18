import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";
import { TranspilerFunctions } from "../../src/transpiler/TranspilerFunctions";

@suite("[Unit] Transpiler Functions", slow(200), timeout(1000)) class TranspilerFunctionsTest {


    @test "Can replace special chars like \\n or \\r"() {

        expect(TranspilerFunctions.replaceReservedChars("\ntest\r q \t")).to.equal("\\ntest\\r q \\t");
    }
}