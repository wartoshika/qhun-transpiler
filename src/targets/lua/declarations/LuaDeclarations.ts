import { LuaClassDeclaration } from "./LuaClassDeclaration";
import { LuaEnumDeclaration } from "./LuaEnumDeclaration";
import { LuaFunctionDeclaration } from "./LuaFunctionDeclaration";
import { LuaImportDeclaration } from "./LuaImportDeclaration";
import { LuaModuleDeclaration } from "./LuaModuleDeclaration";
import { LuaTypeAliasDeclaration } from "./LuaTypeAliasDeclaration";
import { LuaInterfaceDeclaration } from "./LuaInterfaceDeclaration";

export interface LuaDeclarations extends LuaClassDeclaration, LuaEnumDeclaration, LuaFunctionDeclaration, LuaImportDeclaration,
    LuaModuleDeclaration, LuaTypeAliasDeclaration, LuaInterfaceDeclaration { }
