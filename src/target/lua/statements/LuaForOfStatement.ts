import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaForOfStatement extends BaseTarget, Target { }
export class LuaForOfStatement implements Partial<Target> {

    public transpileForOfStatement(node: ts.ForOfStatement): string {

        throw new UnsupportedError(`A for ... of statement is unsupported!`, node);
    }
}
