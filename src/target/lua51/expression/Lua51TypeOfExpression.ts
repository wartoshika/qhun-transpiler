import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { TypeOfExpression, createCall } from "typescript";
import { createTranspiledIdentifier } from "../extendedTypes/TranspiledIdentifier";

export class Lua51TypeOfExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    /**
     * @inheritdoc
     */
    public typeOfExpression(node: TypeOfExpression): string {

        // use the lua function type() to get the type
        return this.transpiler.transpileNode(
            createCall(
                createTranspiledIdentifier("type"),
                undefined,
                [node.expression]
            )
        );
    }
}