import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaObjectBindingPattern extends BaseTarget, Target { }
export class LuaObjectBindingPattern implements Partial<Target> {

    public transpileObjectBindingPattern(node: ts.ObjectBindingPattern): string {

        throw new UnsupportedError(`Object destructing assignments are unsupported!`, node);
    }
}
