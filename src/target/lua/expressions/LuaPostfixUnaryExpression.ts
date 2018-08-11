import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaPostfixUnaryExpression extends BaseTarget, Target { }
export class LuaPostfixUnaryExpression implements Partial<Target> {

    public transpilePostfixUnaryExpression(node: ts.PostfixUnaryExpression): string {

        switch (node.operator) {
            case ts.SyntaxKind.PlusPlusToken:
                return this.transpileNode(
                    ts.createAssignment(
                        node.operand,
                        ts.createBinary(
                            node.operand, ts.SyntaxKind.PlusToken, ts.createLiteral(1)
                        )
                    )
                );
            case ts.SyntaxKind.MinusMinusToken:
                return this.transpileNode(
                    ts.createAssignment(
                        node.operand,
                        ts.createBinary(
                            node.operand, ts.SyntaxKind.MinusToken, ts.createLiteral(1)
                        )
                    )
                );
            default:
                throw new UnsupportedError(`Unsupported postfix unary operator ${ts.SyntaxKind[node.operator]}`, node);
        }
    }
}
