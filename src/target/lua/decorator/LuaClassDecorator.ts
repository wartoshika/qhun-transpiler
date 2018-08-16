import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaClassDecorator extends BaseTarget, Target { }
export class LuaClassDecorator implements Partial<Target> {

    public transpileClassDecorator(node: ts.ClassDeclaration): string {

        throw new UnsupportedError(`Decorators at class level are unsupported!`, node);
    }
}
