import { Target } from "../Target";
import { BaseTarget } from "../BaseTarget";
import * as luaTrait from "./traits";

import * as ts from "typescript";
import { use } from "typescript-mix";

export interface LuaTarget extends BaseTarget, Target,
    luaTrait.LuaBlock, luaTrait.LuaClassDeclaration, luaTrait.LuaEnumDeclaration, luaTrait.LuaFunctionDeclaration,
    luaTrait.LuaImportDeclaration, luaTrait.LuaModuleDeclaration, luaTrait.LuaVariableStatement { }

/**
 * the lua target
 */
export class LuaTarget extends BaseTarget implements Target {

    /**
     * import traits
     */
    @use(
        luaTrait.LuaBlock,
        luaTrait.LuaClassDeclaration,
        luaTrait.LuaEnumDeclaration,
        luaTrait.LuaFunctionDeclaration,
        luaTrait.LuaImportDeclaration,
        luaTrait.LuaModuleDeclaration,
        luaTrait.LuaVariableStatement
    ) protected this: LuaTarget;

    /**
     * a function that is called before the transpiling process begins
     */
    public preTranspile(): string | void {
        return "";
    }

    /**
     * a function that is called after the end of file token and directly after the transpiling process
     */
    public postTranspile(): string | void {
        return "";
    }

}
