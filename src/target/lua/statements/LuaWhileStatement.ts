import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaWhileStatement extends BaseTarget, Target { }
export class LuaWhileStatement implements Partial<Target> {

    public transpileWhileStatement(node: ts.WhileStatement): string {

        // parse the condition
        const condition = this.transpileNode(node.expression);

        // transpile the body
        const body = this.removeEmptyLines(this.addSpacesToString(this.transpileNode(node.statement), 2));

        // put everything together
        return [
            `while ${condition} do`,
            body,
            `end`
        ].join("\n");
    }
}
