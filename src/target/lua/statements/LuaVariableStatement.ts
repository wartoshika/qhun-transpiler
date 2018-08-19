import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaVariableStatement extends BaseTarget, Target { }
export class LuaVariableStatement implements Partial<Target> {

    public transpileVariableStatement(node: ts.VariableStatement): string {

        // check if a declare modifier is present
        if (node.modifiers && node.modifiers.some(mod => mod.kind === ts.SyntaxKind.DeclareKeyword)) {

            // when present, dont transpile this statement because this is an ambient declare
            // statement.
            return "";
        }

        // iterate the declaration list
        return this.transpileNode(node.declarationList);
    }
}
