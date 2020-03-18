import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { PostfixUnaryExpression, SyntaxKind, createBinary, createArrowFunction, createToken, createBlock, createVariableStatement, createVariableDeclarationList, createVariableDeclaration, createIdentifier, NodeFlags, createExpressionStatement, createNumericLiteral, createReturn, createCall, createFunctionExpression, createParen } from "typescript";
import { UnsupportedNodeException } from "../../../exception/UnsupportedNodeException";

export class Lua51PostfixUnaryExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    /**
     * @inheritdoc
     */
    public postfixUnaryExpression(node: PostfixUnaryExpression): string {

        let operator: Parameters<typeof createBinary>[1];
        const oldValueName = "__oldValue";

        switch (node.operator) {
            case SyntaxKind.PlusPlusToken:
                operator = SyntaxKind.PlusToken;
                break;
            case SyntaxKind.MinusMinusToken:
                operator = SyntaxKind.MinusToken;
                break;
            default:
                this.transpiler.registerError({
                    node: node,
                    message: `Unsupported postfix unary expression with operator ${SyntaxKind[node.operator]}!`
                });
                return "[ERROR]";
        }

        // create a function that increments the variable and directly return the old one (postfix)
        const callable = createExpressionStatement(createCall(
            createParen(createFunctionExpression(
                undefined,
                undefined,
                undefined,
                undefined,
                [],
                undefined,
                createBlock(
                    [
                        createVariableStatement(
                            undefined,
                            createVariableDeclarationList(
                                [createVariableDeclaration(
                                    createIdentifier(oldValueName),
                                    undefined,
                                    node.operand
                                )],
                                NodeFlags.Let
                            )
                        ),
                        createExpressionStatement(createBinary(
                            node.operand,
                            createToken(SyntaxKind.EqualsToken),
                            createBinary(
                                node.operand,
                                createToken(operator),
                                createNumericLiteral("1")
                            )
                        )),
                        createReturn(createIdentifier(oldValueName))
                    ],
                    true
                )
            )),
            undefined,
            []
        ));

        return this.transpiler.transpileNode(callable);
    }
}