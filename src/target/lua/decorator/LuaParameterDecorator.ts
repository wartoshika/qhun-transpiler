import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaParameterDecorator extends BaseTarget, Target { }
export class LuaParameterDecorator implements Partial<Target> {

    public transpileParameterDecorator(node: ts.ParameterDeclaration): string {

        return "PARAMETER_DECORATOR";
    }
}
