import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaWhileStatement extends BaseTarget, Target { }
export class LuaWhileStatement implements Partial<Target> {

    public transpileWhileStatement(node: ts.WhileStatement): string {

        return "WHILE";
    }
}
