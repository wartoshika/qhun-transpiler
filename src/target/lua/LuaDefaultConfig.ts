import { DefaultConfigGetter } from "../../config/DefaultConfigGetter";
import { LuaConfig } from "./LuaConfig";

export class LuaDefaultConfig implements DefaultConfigGetter<LuaConfig> {

    public getDefaultConfig(): LuaConfig {

        // currently no default config for lua
        return {};
    }
}
