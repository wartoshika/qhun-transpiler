import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { ArrowFunction, FunctionExpression, createFunctionDeclaration, Block } from "typescript";

export class Lua51FunctionExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    /**
     * @inheritdoc
     */
    public functionExpression(node: FunctionExpression | ArrowFunction): string {

        // reuse the function declaration for function and arrow function expressions
        const functionDeclaration = this.transpiler.transpileNode(createFunctionDeclaration(
            node.decorators,
            node.modifiers,
            node.asteriskToken,
            node.name,
            node.typeParameters,
            node.parameters,
            node.type,
            node.body as Block
        ));

        // remove the local prefix and the new line char
        return functionDeclaration.substring(
            functionDeclaration.indexOf("local ") + 6
        );
    }
}