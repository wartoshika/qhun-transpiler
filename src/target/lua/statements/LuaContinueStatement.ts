import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaContinueStatement extends BaseTarget, Target { }
export class LuaContinueStatement implements Partial<Target> {

    public transpileContinueStatement(node: ts.ContinueStatement): string {

        throw new UnsupportedError(`The continue statement is unsupported!`, node);
    }
}
