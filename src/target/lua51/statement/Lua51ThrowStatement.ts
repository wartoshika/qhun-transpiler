import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { ThrowStatement } from "typescript";

export class Lua51ThrowStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public throwStatement(node: ThrowStatement): string {

        // get the thrown expression
        const expression = node.expression ? this.transpiler.transpileNode(node.expression) : "";

        // lua can only handle string error messages, to wrap the expression with a
        // tostring call for non string literal expressions. the default
        // error level 1 will be used for the positioning.
        let error = `tostring»(»${expression}»)`;

        return `error»(»${error}»)`;
    }
}