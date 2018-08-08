import { expect } from "chai";
import { suite, test } from "mocha-typescript";

import { LuaTarget } from "../../src/targets/lua/LuaTarget";
import * as ts from "typescript";

@suite("test") class Lua {

    @test "asd"() {
        const lua = new LuaTarget();
        expect(lua.transpileVariableStatement(ts.createVariableStatement([], []))).to.equal("VARIABLE");
    }
}