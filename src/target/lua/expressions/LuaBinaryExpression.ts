import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";
import { Types } from "../../../transpiler/Types";
import { LuaBinaryOperations, LuaBinaryOperationsFunctions } from "../special/LuaBinaryOperations";

export interface LuaBinaryExpression extends BaseTarget, Target { }
export class LuaBinaryExpression implements Partial<Target> {

    public transpileBinaryExpression(node: ts.BinaryExpression): string {

        // get left and right nodes
        const left = this.transpileNode(node.left);
        const right = this.transpileNode(node.right);

        // check for bit operations
        if ([
            ts.SyntaxKind.AmpersandToken,
            ts.SyntaxKind.BarToken,
            ts.SyntaxKind.CaretToken,
            ts.SyntaxKind.LessThanLessThanToken,
            ts.SyntaxKind.GreaterThanGreaterThanToken,
            ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken
        ].indexOf(node.operatorToken.kind) !== -1) {
            return this.getBinaryBitOperations(node);
        }

        // get the operator
        const operator = this.getOperatorForToken(node);

        // put everything together
        return `${left} ${operator} ${right}`;
    }

    /**
     * get a lua operator from a token object
     * @param token the token object
     */
    private getOperatorForToken(node: ts.BinaryExpression): string {

        // check the token kindF
        switch (node.operatorToken.kind) {
            case ts.SyntaxKind.AmpersandAmpersandToken:
                return "and";
            case ts.SyntaxKind.BarBarToken:
                return "or";
            case ts.SyntaxKind.AsteriskAsteriskToken:
                return "^";
            case ts.SyntaxKind.EqualsEqualsEqualsToken:
            case ts.SyntaxKind.EqualsEqualsToken:
                return "==";
            case ts.SyntaxKind.EqualsToken:
                return "=";
            case ts.SyntaxKind.ExclamationEqualsToken:
            case ts.SyntaxKind.ExclamationEqualsEqualsToken:
                return "~=";
            case ts.SyntaxKind.AsteriskToken:
                return "*";
            case ts.SyntaxKind.MinusToken:
                return "-";
            case ts.SyntaxKind.SlashToken:
                return "/";
            case ts.SyntaxKind.PercentToken:
                return "%";
            case ts.SyntaxKind.GreaterThanToken:
                return ">";
            case ts.SyntaxKind.GreaterThanEqualsToken:
                return ">=";
            case ts.SyntaxKind.LessThanToken:
                return "<";
            case ts.SyntaxKind.LessThanEqualsToken:
                return "<=";
            case ts.SyntaxKind.PlusToken:

                // the plus token is a special case because lua concats a string with the .. operator and numeric additions with the + token.
                // if the left or the right node is a string type, use .. as concat. otherwise the + token
                // test if one of the types are strings
                if (Types.isString(node.left, this.typeChecker) || Types.isString(node.right, this.typeChecker)) {

                    // yes strings are available
                    return "..";
                } else {

                    // no string available
                    return "+";
                }
            default:
                throw new UnsupportedError(`The given Binary operator token ${ts.SyntaxKind[node.operatorToken.kind]} is not supported!`, node);
        }
    }

    /**
     * transpile binary bit operations
     * @param node the node to transpile
     */
    private getBinaryBitOperations(node: ts.BinaryExpression): string {

        // transpile left and right
        const left = this.transpileNode(node.left);
        const right = this.transpileNode(node.right);

        // build dependencies
        const bitop = new LuaBinaryOperations();

        // get by case
        switch (node.operatorToken.kind) {
            case ts.SyntaxKind.AmpersandToken:
                bitop.declareFunctionsFor(LuaBinaryOperationsFunctions.AND, this);
                return `__bitop_and(${left}, ${right})`;
            case ts.SyntaxKind.BarToken:
                bitop.declareFunctionsFor(LuaBinaryOperationsFunctions.OR, this);
                return `__bitop_or(${left}, ${right})`;
            case ts.SyntaxKind.CaretToken:
                bitop.declareFunctionsFor(LuaBinaryOperationsFunctions.XOR, this);
                return `__bitop_xor(${left}, ${right})`;
            default:
                throw new UnsupportedError(`The given binary operation with operator ${ts.SyntaxKind[node.operatorToken.kind]} is unsupported!`, node);
        }
    }
}
