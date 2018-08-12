import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaComputedPropertyName extends BaseTarget, Target { }
export class LuaComputedPropertyName implements Partial<Target> {

    public transpileComputedPropertyName(node: ts.ComputedPropertyName): string {

        // wrap the expression with brackets
        const expression = this.transpileNode(node.expression);

        return `[${expression}]`;
    }
}
