import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaClassDeclaration extends BaseTarget, Target { }
export class LuaClassDeclaration implements Partial<Target> {

    public transpileClassDeclaration(node: ts.ClassDeclaration): string {

        return "CLASS";
    }
}
