import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaReturnStatement extends BaseTarget, Target { }
export class LuaReturnStatement implements Partial<Target> {

    public transpileReturnStatement(node: ts.ReturnStatement): string {

        return "RETURN";
    }
}
