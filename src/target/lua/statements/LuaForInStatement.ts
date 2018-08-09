import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaForInStatement extends BaseTarget, Target { }
export class LuaForInStatement implements Partial<Target> {

    public transpileForInStatement(node: ts.ForInStatement): string {

        return "FOR_IN";
    }
}
