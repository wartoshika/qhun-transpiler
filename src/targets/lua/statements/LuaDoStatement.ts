import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaDoStatement extends BaseTarget, Target { }
export class LuaDoStatement implements Partial<Target> {

    public transpileDoStatement(node: ts.DoStatement): string {

        return "DO";
    }
}
