import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { BinaryExpression, SyntaxKind, BinaryOperatorToken } from "typescript";
import { UnsupportedNodeException } from "../../../exception/UnsupportedNodeException";

export class Lua51BinaryExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    /**
     * @inheritdoc
     */
    public binaryExpression(node: BinaryExpression): string {

        // check for assignments
        if ([
            SyntaxKind.PlusEqualsToken,
            SyntaxKind.MinusEqualsToken,
            SyntaxKind.AsteriskEqualsToken,
            SyntaxKind.SlashEqualsToken
        ].indexOf(node.operatorToken.kind) !== -1) {
            return this.getBinaryAssignmentOperation(node);
        }

        return this.generateResult(node);
    }

    /**
     * transpiles a binary assignment
     * @param node the node to transpile
     */
    private getBinaryAssignmentOperation(node: BinaryExpression): string {

        // transpile left and right
        const left = this.transpiler.transpileNode(node.left);

        // now check for the operator
        switch (node.operatorToken.kind) {

            case SyntaxKind.FirstCompoundAssignment:
            case SyntaxKind.PlusEqualsToken:
                return `${left} = ${this.generateResult(node, SyntaxKind.PlusToken)}`;
            case SyntaxKind.MinusEqualsToken:
                return `${left} = ${this.generateResult(node, SyntaxKind.MinusToken)}`;
            case SyntaxKind.AsteriskEqualsToken:
                return `${left} = ${this.generateResult(node, SyntaxKind.AsteriskToken)}`;
            case SyntaxKind.SlashEqualsToken:
                return `${left} = ${this.generateResult(node, SyntaxKind.SlashToken)}`;
            default:
                throw new UnsupportedNodeException(`The given binary assignment operation operator ${SyntaxKind[node.operatorToken.kind]} is unsupported!`, node);
        }
    }

    private generateResult(node: BinaryExpression, operator?: SyntaxKind): string {

        const left = this.transpiler.transpileNode(node.left);
        const right = this.transpiler.transpileNode(node.right);

        // get the operator
        const op = this.getOperatorForToken(node, operator || node.operatorToken.kind);
        const parenRight = typeof operator !== "undefined";

        // put everything together
        let res = `${left}»${op}»${right}`;

        // add parenthes for assignment expressions to avoid wrong results for numeric expressions
        if (parenRight) {
            res = res.replace(`${left}»${op}»`, `${left}»${op}»(»`);
            res += `»)`;
        }

        return res;
    }

    /**
     * get a lua operator from a token object
     * @param token the token object
     */
    private getOperatorForToken(node: BinaryExpression, operator: SyntaxKind): string {

        // check the token kindF
        switch (operator) {
            case SyntaxKind.AmpersandAmpersandToken:
                return "and";
            case SyntaxKind.BarBarToken:
                return "or";
            case SyntaxKind.AsteriskAsteriskToken:
                return "^";
            case SyntaxKind.EqualsEqualsEqualsToken:
            case SyntaxKind.EqualsEqualsToken:
                return "==";
            case SyntaxKind.EqualsToken:
                return "=";
            case SyntaxKind.ExclamationEqualsToken:
            case SyntaxKind.ExclamationEqualsEqualsToken:
                return "~=";
            case SyntaxKind.AsteriskToken:
                return "*";
            case SyntaxKind.MinusToken:
                return "-";
            case SyntaxKind.SlashToken:
                return "/";
            case SyntaxKind.PercentToken:
                return "%";
            case SyntaxKind.GreaterThanToken:
                return ">";
            case SyntaxKind.GreaterThanEqualsToken:
                return ">=";
            case SyntaxKind.LessThanToken:
                return "<";
            case SyntaxKind.LessThanEqualsToken:
                return "<=";
            case SyntaxKind.PlusToken:

                // the plus token is a special case because lua concats a string with the .. operator and numeric additions with the + token.
                // if the left or the right node is a string type, use .. as concat. otherwise the + token
                // test if one of the types are strings
                if (this.transpiler.typeHelper().isString(node.left) || this.transpiler.typeHelper().isString(node.right)) {

                    // yes strings are available
                    return "..";
                } else {

                    // no string available
                    return "+";
                }
            default:
                throw new UnsupportedNodeException(`The given Binary operator token ${SyntaxKind[node.operatorToken.kind]} is not supported!`, node);
        }
    }
}