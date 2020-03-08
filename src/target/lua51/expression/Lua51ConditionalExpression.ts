import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { ConditionalExpression, createIf, createBlock, createReturn, createCall, createParen, createFunctionExpression } from "typescript";

export class Lua51ConditionalExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    /**
     * @inheritdoc
     */
    public conditionalExpression(node: ConditionalExpression): string {

        return this.transpiler.transpileNode(
            createCall(
                createParen(createFunctionExpression(
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    [],
                    undefined,
                    createBlock(
                        [createIf(
                            node.condition,
                            createBlock(
                                [createReturn(node.whenTrue)],
                                true
                            ),
                            createBlock(
                                [createReturn(node.whenFalse)],
                                true
                            )
                        )],
                        true
                    )
                )),
                undefined,
                []
            )
        );
    }
}