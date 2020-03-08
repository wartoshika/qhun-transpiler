import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { ArrayLiteralExpression } from "typescript";

export class Lua51ArrayLiteralExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    /**
     * @inheritdoc
     */
    public arrayLiteralExpression(node: ArrayLiteralExpression): string {

        // use bracket chars to wrap the whole element list
        const elementList: string[] = node.elements.map(element => this.transpiler.transpileNode(element));

        // join them by the commata symbol
        return `{${this.transpiler.space()}${elementList.join(`,${this.transpiler.space()}`)}${this.transpiler.space()}}`;
    }
}