import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaThrowStatement extends BaseTarget, Target { }
export class LuaThrowStatement implements Partial<Target> {

    public transpileThrowStatement(node: ts.ThrowStatement): string {

        return "THROW";
    }
}
