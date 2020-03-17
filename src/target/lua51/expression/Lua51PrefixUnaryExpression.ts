import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { PrefixUnaryExpression, SyntaxKind, createBinary, createExpressionStatement, createCall, createFunctionExpression, createParen, createBlock, createVariableStatement, createVariableDeclarationList, createVariableDeclaration, createIdentifier, NodeFlags, createToken, createNumericLiteral, createReturn } from "typescript";
import { UnsupportedNodeException } from "../../../exception/UnsupportedNodeException";

export class Lua51PrefixUnaryExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    /**
     * @inheritdoc
     */
    public prefixUnaryExpression(node: PrefixUnaryExpression): string {

        let operator: Parameters<typeof createBinary>[1];
        const oldValueName = "__oldValue";

        switch (node.operator) {
            case SyntaxKind.PlusPlusToken:
                operator = SyntaxKind.PlusToken;
                break;
            case SyntaxKind.MinusMinusToken:
                operator = SyntaxKind.MinusToken;
                break;
            case SyntaxKind.ExclamationToken:
                return `(»not ${this.transpiler.transpileNode(node.operand)}»)`;
            case SyntaxKind.MinusToken:
                return `-${this.transpiler.transpileNode(node.operand)}`;
            /*case SyntaxKind.TildeToken:
                const binary = new LuaBinaryOperations();
                binary.declareFunctionsFor(LuaBinaryOperationsFunctions.NOT, this);
                return `${LuaBinaryOperationsFunctions.NOT}(${this.transpileNode(node.operand)})`;*/
            default:
                throw new UnsupportedNodeException(`Unsupported ${SyntaxKind[SyntaxKind.PrefixUnaryExpression]} with operator ${SyntaxKind[node.operator]}!`, node)
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