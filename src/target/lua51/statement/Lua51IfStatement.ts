import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { IfStatement, isIfStatement } from "typescript";

export class Lua51IfStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public ifStatement(node: IfStatement): string {

        // get the if condition
        const condition = this.transpiler.transpileNode(node.expression);

        // get the then statement
        const thenStatement = this.transpiler.addIntend(this.transpiler.transpileNode(node.thenStatement));

        // check for an else statement
        let elseOrEnd: string = "end";
        if (node.elseStatement) {

            // look for elseif
            if (isIfStatement(node.elseStatement)) {

                // add elseif statement
                elseOrEnd = [
                    `else${this.transpiler.transpileNode(node.elseStatement)}`
                ].join(this.transpiler.break());
            } else {
                // add else statement
                elseOrEnd = [
                    `else`,
                    this.transpiler.addIntend(this.transpiler.transpileNode(node.elseStatement)),
                    `end`
                ].join(this.transpiler.break());
            }
        }

        // put all together
        return [
            `if ${condition} then`,
            thenStatement,
            elseOrEnd
        ].join(this.transpiler.break());
    }
}