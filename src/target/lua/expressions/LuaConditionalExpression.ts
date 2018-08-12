import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaConditionalExpression extends BaseTarget, Target { }
export class LuaConditionalExpression implements Partial<Target> {

    public transpileConditionalExpression(node: ts.ConditionalExpression): string {

        // add code declaration
        this.addDeclaration(
            "global.tenary",
            [
                `local function __global_tenary(c, t, f)`,
                this.addSpacesToString(`if c then`, 2),
                this.addSpacesToString(`return t`, 4),
                this.addSpacesToString(`else`, 2),
                this.addSpacesToString(`return f`, 4),
                this.addSpacesToString(`end`, 2),
                `end`
            ].join("\n")
        );

        // use the declared tenary function
        const condition = this.transpileNode(node.condition);
        const whenTrue = this.transpileNode(node.whenTrue);
        const whenFalse = this.transpileNode(node.whenFalse);
        return `__global_tenary(${condition}, ${whenTrue}, ${whenFalse})`;
    }
}
