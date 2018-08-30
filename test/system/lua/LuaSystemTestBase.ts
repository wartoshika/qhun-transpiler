import { IntegrationTestBase } from "../../integration/IntegrationTestBase";
import { LuaConfig } from "../../../src/target/lua/LuaConfig";
import LuaVM = require("lua.vm.js");

export class LuaSystemTestBase extends IntegrationTestBase {

    /**
     * transpiles the given typescript code into lua and interpret
     * the transpiled lua code with a lua parser. return the result of
     * the parsing process
     * @param code the given ts code to parse
     */
    public getLuaParseResult(code: string, config?: LuaConfig): any {

        // transpile the given typescript code
        const transpiled = this.transpile("lua", code, config, true);

        // build a vm state
        const luaState = new LuaVM.Lua.State();

        // execute the transpiled source code
        return luaState.execute(transpiled.join("\n"));
    }
}