import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { Types } from "../../../transpiler/Types";

export interface LuaThrowStatement extends BaseTarget, Target { }
export class LuaThrowStatement implements Partial<Target> {

    public transpileThrowStatement(node: ts.ThrowStatement): string {

        // get the thrown expression
        const expression = this.transpileNode(node.expression);

        // lua can only handle string error messages, to wrap the expression with a
        // tostring call for non string literal expressions. the default
        // error level 1 will be used for the positioning.
        let error: string = expression;
        if (!Types.isString(node.expression, this.typeChecker)) {
            error = `tostring(${expression})`;
        }

        return `error(${error})`;
    }
}
