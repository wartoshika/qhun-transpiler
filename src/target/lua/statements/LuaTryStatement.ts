import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaTryStatement extends BaseTarget, Target { }
export class LuaTryStatement implements Partial<Target> {

    public transpileTryStatement(node: ts.TryStatement): string {

        return "TRY";
    }
}
