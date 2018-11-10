import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { expect } from "chai";
import * as ts from "typescript";
import { UnsupportedError } from "../../../src/error/UnsupportedError";

@suite("[Unit] Target: Lua | Misc transpiler tests", slow(1000), timeout(10000)) class LuaMiscTranspilerTests extends UnitTest {

    @test "EndOfFileToken"() {

        const target = this.createTarget("lua");

        expect(target.transpileEndOfFileToken(ts.createToken(ts.SyntaxKind.EndOfFileToken))).to.equal("\n");
    }

    @test "Export assignments"() {

        this.runCodeAndExpectThrow("lua", [{
            code: `
                const a = "test";
                export = a;
            `,
            throw: UnsupportedError
        }]);
    }

    @test "Object binding pattern"() {

        this.runCodeAndExpectThrow("lua", [{
            code: `
                const {x, y} = {x: 10, y: 20};
            `,
            throw: UnsupportedError
        }]);
    }
}