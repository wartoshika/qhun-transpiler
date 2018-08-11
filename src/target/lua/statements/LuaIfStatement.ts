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
        let elseOrEnd: string = "end";
        if (node.elseStatement) {

            // look for elseif
            if (ts.isIfStatement(node.elseStatement)) {

                // add elseif statement
                elseOrEnd = [
                    `else${this.transpileNode(node.elseStatement)}`
                ].join("\n");
            } else {
                // add else statement
                elseOrEnd = [
                    `else`,
                    this.addSpacesToString(this.transpileNode(node.elseStatement), 2),
                    `end`
                ].join("\n");
            }
        }

        // put all together
        return [
            `if ${condition} then`,
            thenStatement,
            elseOrEnd
        ].join("\n");
    }
}
