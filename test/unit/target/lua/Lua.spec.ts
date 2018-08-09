import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { LuaTarget } from "../../../../src/target/lua/LuaTarget";

import * as ts from "typescript";

@suite("test") class Lua extends UnitTest {

    private target: LuaTarget;

    public before(): void {
        this.target = this.getTarget("lua");
    }

    @test "asd"() {

        expect(this.target.transpileVariableStatement(ts.createVariableStatement([], []))).to.equal("VARIABLE");
    }
}