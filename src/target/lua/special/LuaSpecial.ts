import { LuaStringSpecial } from "./LuaStringSpecial";
import { LuaObjectSpecial } from "./LuaObjectSpecial";
import { LuaArraySpecial } from "./LuaArraySpecial";

export interface LuaSpecial extends LuaStringSpecial, LuaObjectSpecial, LuaArraySpecial { }
