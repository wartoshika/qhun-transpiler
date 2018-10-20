import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaObjectLiteralExpression extends BaseTarget, Target { }
export class LuaObjectLiteralExpression implements Partial<Target> {

    public transpileObjectLiteralExpression(node: ts.ObjectLiteralExpression): string {

        // visit each property
        const propertyStack: string[] = [];
        node.properties.forEach(property => {

            let nameOrKey = this.transpileNode(property.name);
            let initializer: string = "";

            // check if there is an initializer
            if (ts.isPropertyAssignment(property)) {
                initializer = this.transpileNode(property.initializer);

            } else {
                throw new UnsupportedError(`ObjectLiterals Element ${ts.SyntaxKind[property.kind]} is unsupported!`, property);
            }

            // if the initializer was a string literal, add computed property brackets
            // because lua does not unterstand {"test" = 1}
            if (ts.isStringLiteral(property.name)) {

                nameOrKey = this.transpileComputedPropertyName(ts.createComputedPropertyName(property.name));
            }

            // add the property
            propertyStack.push(`${nameOrKey} = ${initializer}`);
        });

        // wrap all properties
        return `{${propertyStack.join(", ")}}`;
    }
}
