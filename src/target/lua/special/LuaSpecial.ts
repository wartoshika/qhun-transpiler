import { LuaStringSpecial } from "./LuaStringSpecial";
import { LuaObjectSpecial } from "./LuaObjectSpecial";
import { LuaArraySpecial } from "./LuaArraySpecial";
import { LuaMathSpecial } from "./LuaMathSpecial";

export interface LuaSpecial extends LuaStringSpecial, LuaObjectSpecial, LuaArraySpecial, LuaMathSpecial { }
