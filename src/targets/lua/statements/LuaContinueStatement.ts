import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaContinueStatement extends BaseTarget, Target { }
export class LuaContinueStatement implements Partial<Target> {

    public transpileContinueStatement(node: ts.ContinueStatement): string {

        return "CONTINUE";
    }
}
