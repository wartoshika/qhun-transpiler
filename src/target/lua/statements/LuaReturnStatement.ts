import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaReturnStatement extends BaseTarget, Target { }
export class LuaReturnStatement implements Partial<Target> {

    public transpileReturnStatement(node: ts.ReturnStatement): string {

        // if the node is no expression, then return nil
        let expression: string = "";
        if (node.expression) {

            // add a space before the return expression
            expression += " ";

            // check for special tuple return statements
            if (node.expression.kind === ts.SyntaxKind.ArrayLiteralExpression) {

                // handle special case
                expression += this.transpileTupleReturnStatement(node.expression as ts.ArrayLiteralExpression);
            } else {

                // use normal node transpiling
                expression = " " + this.transpileNode(node.expression);
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
    private transpileTupleReturnStatement(node: ts.ArrayLiteralExpression): string {

        // iterate over all elements of the tuple and transpile its content
        return node.elements.map(element => {

            return this.transpileNode(element);
        }).join(", ");
    }
}
