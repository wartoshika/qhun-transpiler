import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaClassExpression extends BaseTarget, Target { }
export class LuaClassExpression implements Partial<Target> {

    public transpileClassExpression(node: ts.ClassExpression): string {

        // use the existing name or generate a new unique name
        const className: string = node.name ? this.transpileNode(node.name) : this.generateUniqueVariableName("classExpression");

        // create the class declaration
        const classDeclaration = this.transpileClassDeclaration(ts.createClassDeclaration(
            node.decorators,
            node.modifiers,
            className,
            node.typeParameters,
            node.heritageClauses,
            node.members
        ));

        // wrap the existing declaration to get the class reference for the expression
        const expressionStack: string[] = [
            "(function () ",
            this.addSpacesToString(classDeclaration, 2),
            this.addSpacesToString(`return ${className}`, 2),
            "end)()"
        ];

        return expressionStack.join("\n");
    }
}
