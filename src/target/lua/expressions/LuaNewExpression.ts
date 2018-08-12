import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { LuaKeywords } from "../LuaKeywords";

export interface LuaNewExpression extends BaseTarget, Target { }
export class LuaNewExpression implements Partial<Target> {

    public transpileNewExpression(node: ts.NewExpression): string {

        // get the called class name
        const className = this.transpileNode(node.expression);

        // build the parameter stack
        const paramStack: string[] = [
            "true",
            ...node.arguments.map(this.transpileNode)
        ];

        // use the new method on the class
        return `${className}.${LuaKeywords.CLASS_NEW_FUNCTION_NAME}(${paramStack.join(", ")})`;
    }
}
