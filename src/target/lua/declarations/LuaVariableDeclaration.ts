import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { LuaArrayBindingPattern } from "../misc";
import { StrictIdentifier } from "../../../transpiler/nodes/StrictIdentifier";

export interface LuaVariableDeclaration extends BaseTarget, Target, LuaArrayBindingPattern { }
export class LuaVariableDeclaration implements Partial<Target> {

    public transpileVariableDeclaration(node: ts.VariableDeclaration): string {

        let left: string = "";
        let right: string = "";

        // a stack for later modifiers
        const modifierStack: ((node: ts.VariableDeclaration) => string)[] = [];

        // check for a possible export
        if (this.hasExportModifier(node)) {
            this.addExport(this.transpileNode(node.name), node);
        }

        // handle some special cases
        if (node.initializer) {
            if (
                // check for array destructing with dotdotdot token on the left side of the assignment
                ts.isArrayBindingPattern(node.name) && node.name.elements.some(element => {
                    if (ts.isBindingElement(element)) {
                        return !!element.dotDotDotToken;
                    }
                    return false;
                })) {

                // array destructing with rest argument on the left side and no array literal on the right side
                // wrap the right expression with a table and to allow the array destructing class handle the assignment properly
                let expressionToParse: ts.Expression = ts.createArrayLiteral([node.initializer]);
                if (node.initializer.kind === ts.SyntaxKind.ArrayLiteralExpression) {
                    expressionToParse = node.initializer;
                }
                right = this.transpileNode(expressionToParse);

                // add a modifier to destruct the wrapped element
                modifierStack.push(this.arrayBindingPatternModifierDestructWrappedElement.bind(this));

            } else if (
                // search for array destructing with array literal on the right side
                ts.isArrayBindingPattern(node.name) && ts.isArrayLiteralExpression(node.initializer)) {

                // elements should be outputed via multi return
                right = node.initializer.elements
                    .map(element => this.transpileNode(element))
                    .join(", ");
            }
        }

        // check for default cases
        if (!left) {
            left = this.transpileNode(node.name);
        }
        if (!right) {
            right = this.transpileNode(node.initializer || ts.createNull());
        }

        // build the code stack
        const codeStack: string[] = [];

        // push the basic assignment
        codeStack.push(`local ${this.transpileNode(ts.createBinary(
            ts.createIdentifier(left),
            ts.SyntaxKind.EqualsToken,
            new StrictIdentifier(right) as ts.Identifier
        ))}`);

        // add possible assignment modifiers
        codeStack.push(...modifierStack.map(modifier => modifier(node)));

        // use a binary expression as variable declaration
        return this.removeEmptyLines(codeStack.join("\n")) + "\n";

    }
}
