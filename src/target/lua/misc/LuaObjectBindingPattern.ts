import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaObjectBindingPattern extends BaseTarget, Target { }
export class LuaObjectBindingPattern implements Partial<Target> {

    public transpileObjectBindingPattern(node: ts.ObjectBindingPattern): string {

        return "Object_BINDING";
    }
}
