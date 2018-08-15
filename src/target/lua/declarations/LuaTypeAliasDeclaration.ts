import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaTypeAliasDeclaration extends BaseTarget, Target { }
export class LuaTypeAliasDeclaration implements Partial<Target> {

    public transpileTypeAliasDeclaration(node: ts.TypeAliasDeclaration): string {

        // a type alias must be skipped in lua
        return "";
    }
}
