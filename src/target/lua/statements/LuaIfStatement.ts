import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaIfStatement extends BaseTarget, Target { }
export class LuaIfStatement implements Partial<Target> {

    public transpileIfStatement(node: ts.IfStatement): string {

        // get the if condition
        const condition = this.transpileNode(node.expression);

        // get the then statement
        const thenStatement = this.addSpacesToString(this.removeLastNewLine(this.transpileNode(node.thenStatement)), 2);

        // check for an else statement
        let elseStatement: string = "";
        if (node.elseStatement) {

            elseStatement = this.transpileNode(node.elseStatement);
        }

        // put all together
        return [
            `if ${condition} then`,
            thenStatement,
            `end`
        ].join("\n");
    }
}
