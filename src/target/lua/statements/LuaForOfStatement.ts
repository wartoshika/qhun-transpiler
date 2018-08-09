import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaForOfStatement extends BaseTarget, Target { }
export class LuaForOfStatement implements Partial<Target> {

    public transpileForOfStatement(node: ts.ForOfStatement): string {

        return "FOR_OF";
    }
}
