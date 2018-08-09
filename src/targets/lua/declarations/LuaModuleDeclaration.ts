import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaModuleDeclaration extends BaseTarget, Target { }
export class LuaModuleDeclaration implements Partial<Target> {

    public transpileModuleDeclaration(node: ts.ModuleDeclaration): string {

        return "MODULE";
    }
}
