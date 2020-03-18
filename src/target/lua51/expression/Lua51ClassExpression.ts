import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { ClassExpression, createIdentifier, createClassDeclaration } from "typescript";

export class Lua51ClassExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    /**
     * @inheritdoc
     */
    public classExpression(node: ClassExpression): string {

        // use the existing name or generate a new unique name
        const className: string = this.transpiler.transpileNode(node.name || createIdentifier(this.transpiler.generateUniqueIdentifier("classExpr")));

        // create the class declaration
        const classDeclaration = this.transpiler.transpileNode(createClassDeclaration(
            node.decorators,
            node.modifiers,
            className,
            node.typeParameters,
            node.heritageClauses,
            node.members
        ));

        // wrap the existing declaration to get the class reference for the expression
        const expressionStack: string[] = [
            "(»function»()",
            this.transpiler.addIntend(classDeclaration),
            this.transpiler.addIntend(`return ${className}`),
            "end»)»(»)»"
        ];

        return expressionStack.join(this.transpiler.break());
    }
}