import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { ReturnStatement, SyntaxKind, ArrayLiteralExpression } from "typescript";

export class Lua51ReturnStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public returnStatement(node: ReturnStatement): string {

        // if the node is no expression, then return nil
        let expression: string = "";
        if (node.expression) {

            // add a space before the return expression
            expression += " ";

            // check for special tuple return statements
            if (node.expression.kind === SyntaxKind.ArrayLiteralExpression) {

                // handle special case
                expression += this.transpileTupleReturnStatement(node.expression as ArrayLiteralExpression);
            } else {

                // use normal node transpiling
                expression = " " + this.transpiler.transpileNode(node.expression);
            }
        } else {
            expression = "";
        }

        return `return${expression}`;
    }

    /**
     * transpiles a tuple return to lua multireturn
     * @param node the node to transpile
     */
    private transpileTupleReturnStatement(node: ArrayLiteralExpression): string {

        // iterate over all elements of the tuple and transpile its content
        return node.elements.map(element => {

            return this.transpiler.transpileNode(element);
        }).join(`,»`);
    }
}