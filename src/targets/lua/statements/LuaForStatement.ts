import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaForStatement extends BaseTarget, Target { }
export class LuaForStatement implements Partial<Target> {

    public transpileForStatement(node: ts.ForStatement): string {

        return "FOR";
    }
}
