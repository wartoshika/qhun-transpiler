import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaArrayBindingPattern extends BaseTarget, Target { }
export class LuaArrayBindingPattern implements Partial<Target> {

    public transpileArrayBindingPattern(node: ts.ArrayBindingPattern): string {
        console.log(node);
        return "ARRAY_BINDING";
    }
}
