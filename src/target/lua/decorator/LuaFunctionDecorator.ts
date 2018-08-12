import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaFunctionDecorator extends BaseTarget, Target { }
export class LuaFunctionDecorator implements Partial<Target> {

    public transpileFunctionDecorator(node: ts.FunctionDeclaration): string {

        return "FUNCTION_DECORATOR";
    }
}
