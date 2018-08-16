import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaParameterDecorator extends BaseTarget, Target { }
export class LuaParameterDecorator implements Partial<Target> {

    public transpileParameterDecorator(node: ts.ParameterDeclaration): string {

        throw new UnsupportedError(`Decorators at parameter level are unsupported!`, node);
    }
}
