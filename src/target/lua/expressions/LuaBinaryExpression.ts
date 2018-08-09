import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaBinaryExpression extends BaseTarget, Target { }
export class LuaBinaryExpression implements Partial<Target> {

    public transpileBinaryExpression(node: ts.BinaryExpression): string {

        // get left and right nodes
        const left = this.transpileNode(node.left);
        const right = this.transpileNode(node.right);

        // check that operator
        switch (node.operatorToken.kind) {
            case ts.SyntaxKind.AmpersandAmpersandToken:
                return `${left} and ${right}`;
            case ts.SyntaxKind.BarBarToken:
                return `${left} or ${right}`;
            case ts.SyntaxKind.AsteriskAsteriskToken:
                return `${left}^${right}`;
            case ts.SyntaxKind.EqualsEqualsEqualsToken:
                return `${left}==${right}`;
            case ts.SyntaxKind.ExclamationEqualsEqualsToken:
            case ts.SyntaxKind.ExclamationEqualsToken:
                return `${left}~=${right}`;
            default:
                const operator = node.operatorToken.getText();
                return `${left} ${operator} ${right}`;
        }
    }
}
