import { Target } from "../Target";
import * as ts from "typescript";
import { BaseTarget } from "../BaseTarget";

export interface LuaImportDeclaration extends BaseTarget, Target { }
export class LuaImportDeclaration implements Partial<Target> {

    public transpileImportDeclaration(node: ts.ImportDeclaration): string {

        return "IMPORT";
    }
}
