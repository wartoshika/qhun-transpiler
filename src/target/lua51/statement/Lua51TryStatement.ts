import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { TryStatement, createFunctionExpression, createParameter, createIdentifier, createBlock, createStatement, createCall, NodeFlags, createVariableStatement, createVariableDeclarationList, createVariableDeclaration, createArrayBindingPattern, createBindingElement, createIf, createBinary, createToken, SyntaxKind, createKeywordTypeNode, createReturn, createNull } from "typescript";
import { createTranspiledIdentifier } from "../extendedTypes/TranspiledIdentifier";

export class Lua51TryStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public tryStatement(node: TryStatement): string {

        const trySuccessVariableName = "__success";
        const tryReturnVariableName = "__returnValue";

        // build two anonymous functions that can be passed to xpcall
        const tryHandler = createFunctionExpression(
            undefined,
            undefined,
            undefined,
            [],
            undefined,
            undefined,
            node.tryBlock
        );

        // now the catch function
        // get the error var name
        let errorVarName: string = "";
        if (node.catchClause && node.catchClause.variableDeclaration) {
            errorVarName = this.transpiler.transpileNode(node.catchClause.variableDeclaration.name);
        }

        // build the catch handler function
        const catchHandler = createFunctionExpression(
            undefined,
            undefined,
            undefined,
            undefined,
            [createParameter(
                undefined,
                undefined,
                undefined,
                createTranspiledIdentifier(errorVarName),
                undefined,
                undefined,
                undefined
            )],
            undefined,
            node.catchClause ? node.catchClause.block : createBlock(
                [
                    createStatement(
                        createFunctionExpression(
                            undefined,
                            undefined,
                            undefined,
                            [],
                            undefined,
                            undefined,
                            node.tryBlock
                        )
                    )
                ], true
            )
        );

        // build the try catch
        const tryCatch: string[] = [
            this.transpiler.transpileNode(
                createVariableStatement(
                    undefined,
                    createVariableDeclarationList(
                        [createVariableDeclaration(
                            createArrayBindingPattern([
                                createBindingElement(
                                    undefined,
                                    undefined,
                                    createIdentifier(trySuccessVariableName),
                                    undefined
                                ),
                                createBindingElement(
                                    undefined,
                                    undefined,
                                    createIdentifier(tryReturnVariableName),
                                    undefined
                                )
                            ]),
                            undefined,
                            createCall(
                                createTranspiledIdentifier("xpcall"),
                                undefined,
                                [
                                    tryHandler,
                                    catchHandler
                                ]
                            )
                        )],
                        NodeFlags.Const
                    )
                )
            )
        ];

        // test if the tryCatch returns something
        tryCatch.push(
            this.transpiler.transpileNode(
                createIf(
                    createBinary(
                        createIdentifier(tryReturnVariableName),
                        createToken(SyntaxKind.ExclamationEqualsEqualsToken),
                        createNull()
                    ),
                    createBlock(
                        [createReturn(createIdentifier(tryReturnVariableName))],
                        true
                    ),
                    undefined
                )
            )
        )

        // add the optional finally
        if (node.finallyBlock) {
            tryCatch.push(this.transpiler.transpileNode(node.finallyBlock));
        }

        // join by new line
        return tryCatch.join(this.transpiler.break());
    }
}