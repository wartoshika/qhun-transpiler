import { LuaClassDecorator } from "./LuaClassDecorator";
import { LuaFunctionDecorator } from "./LuaFunctionDecorator";
import { LuaParameterDecorator } from "./LuaParameterDecorator";
import { LuaPropertyDecorator } from "./LuaPropertyDecorator";

export interface LuaDecorators extends LuaClassDecorator, LuaFunctionDecorator, LuaParameterDecorator, LuaPropertyDecorator { }
