import { Target } from "../Target";
import * as ts from "typescript";
import { BaseTarget } from "../BaseTarget";

export interface LuaFunctionDeclaration extends BaseTarget, Target { }
export class LuaFunctionDeclaration implements Partial<Target> {

    public transpileFunctionDeclaration(node: ts.FunctionDeclaration): string {

        return "FUNCTION";
    }
}
