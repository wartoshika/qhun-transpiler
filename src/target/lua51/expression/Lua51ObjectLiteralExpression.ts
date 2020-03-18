import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { ObjectLiteralExpression, SyntaxKind, isPropertyAssignment, isStringLiteral } from "typescript";
import { UnsupportedNodeException } from "../../../exception/UnsupportedNodeException";

export class Lua51ObjectLiteralExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    /**
     * @inheritdoc
     */
    public objectLiteralExpression(node: ObjectLiteralExpression): string {

        // visit each property
        const propertyStack: string[] = [];
        node.properties.forEach(property => {

            if (!property.name) {
                this.transpiler.registerError({
                    node: property,
                    message: `Unsupported ${SyntaxKind[SyntaxKind.ObjectLiteralExpression]} containing a property with no name!`
                });
                return "[ERROR]";
            }

            let nameOrKey = this.transpiler.transpileNode(property.name);
            let initializer: string = "";

            // check if there is an initializer
            if (isPropertyAssignment(property)) {
                initializer = this.transpiler.transpileNode(property.initializer);

            } else {
                this.transpiler.registerError({
                    node: property,
                    message: `ObjectLiterals Element ${SyntaxKind[property.kind]} is unsupported!`
                });
                return "[ERROR]";
            }

            /* @todo: computed properties!
            // if the initializer was a string literal, add computed property brackets
            // because lua does not unterstand {"test" = 1}
            if (isStringLiteral(property.name)) {

                nameOrKey = this.transpileComputedPropertyName(ts.createComputedPropertyName(property.name));
            }
            */

            // add the property
            propertyStack.push(`${nameOrKey}»=»${initializer}`);
        });

        // wrap all properties
        return `{»${propertyStack.join(`,»`)}»}`;
    }
}