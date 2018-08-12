import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaClassDecorator extends BaseTarget, Target { }
export class LuaClassDecorator implements Partial<Target> {

    public transpileClassDecorator(node: ts.ClassDeclaration): string {

        return "CLASS_DECORATOR";
    }
}
