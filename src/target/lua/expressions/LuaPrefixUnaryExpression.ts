import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";
import { LuaBinaryOperations, LuaBinaryOperationsFunctions } from "../special/LuaBinaryOperations";

export interface LuaPrefixUnaryExpression extends BaseTarget, Target { }
export class LuaPrefixUnaryExpression implements Partial<Target> {

    public transpilePrefixUnaryExpression(node: ts.PrefixUnaryExpression): string {

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
            case ts.SyntaxKind.ExclamationToken:
                return `(not ${this.transpileNode(node.operand)})`;
            case ts.SyntaxKind.MinusToken:
                return `-${this.transpileNode(node.operand)}`;
            case ts.SyntaxKind.TildeToken:
                const binary = new LuaBinaryOperations();
                binary.declareFunctionsFor(LuaBinaryOperationsFunctions.NOT, this);
                return `${LuaBinaryOperationsFunctions.NOT}(${this.transpileNode(node.operand)})`;
        }
    }
}
