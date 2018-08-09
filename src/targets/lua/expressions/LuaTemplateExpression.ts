import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaTemplateExpression extends BaseTarget, Target { }
export class LuaTemplateExpression implements Partial<Target> {

    public transpileTemplateExpression(node: ts.TemplateExpression): string {

        return "TEMPLATE_EXPRESSION";
    }
}
