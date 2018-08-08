import { Target } from "../Target";
import * as ts from "typescript";
import { BaseTarget } from "../BaseTarget";

export interface LuaVariableStatement extends BaseTarget, Target { }
export class LuaVariableStatement implements Partial<Target> {

    public transpileVariableStatement(node: ts.VariableStatement): string {

        return "VARIABLE";
    }
}
