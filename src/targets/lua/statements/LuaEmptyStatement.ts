import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaEmptyStatement extends BaseTarget, Target { }
export class LuaEmptyStatement implements Partial<Target> {

    public transpileEmptyStatement(node: ts.EmptyStatement): string {

        return "EMPTY";
    }
}
