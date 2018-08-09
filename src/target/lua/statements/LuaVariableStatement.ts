import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaVariableStatement extends BaseTarget, Target { }
export class LuaVariableStatement implements Partial<Target> {

    public transpileVariableStatement(node: ts.VariableStatement): string {

        // iterate the declaration list
        return this.transpileNode(node.declarationList);
    }
}
