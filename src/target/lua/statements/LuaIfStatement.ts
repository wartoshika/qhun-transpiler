import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaIfStatement extends BaseTarget, Target { }
export class LuaIfStatement implements Partial<Target> {

    public transpileIfStatement(node: ts.IfStatement): string {

        return "IF";
    }
}
