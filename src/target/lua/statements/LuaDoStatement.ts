import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaDoStatement extends BaseTarget, Target { }
export class LuaDoStatement implements Partial<Target> {

    public transpileDoStatement(node: ts.DoStatement): string {

        // get the footer condition
        const condition = this.transpileNode(node.expression);

        // get the body
        const body = this.transpileNode(node.statement);

        // put everything together
        return [
            `repeat`,
            this.removeEmptyLines(this.addSpacesToString(body, 2)),
            // the condition must be negated!
            `until not (${condition})`
        ].join("\n");
    }
}
