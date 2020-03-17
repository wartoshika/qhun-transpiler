import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { DeclarationTranspiler } from "../../../transpiler";
import { VariableDeclaration, isArrayBindingPattern, isBindingElement, Expression, createArrayLiteral, SyntaxKind, isArrayLiteralExpression, createNull, createBinary, createIdentifier } from "typescript";
import { createTranspiledExpression } from "../extendedTypes/TranspiledExpression";

export class Lua51VariableDeclaration extends PartialTranspiler implements Partial<DeclarationTranspiler> {

    /**
     * @inheritdoc
     */
    public variableDeclaration(node: VariableDeclaration): string {

        let left: Expression | undefined = undefined;
        let right: Expression | undefined = undefined;

        // a stack for later modifiers
        const modifierStack: ((node: VariableDeclaration) => string)[] = [];

        // check for a possible export
        if (this.transpiler.typeHelper().hasExportModifier(node)) {
            this.transpiler.registerExport(this.transpiler.transpileNode(node.name));
        }

        // handle some special cases
        if (node.initializer) {
            if (
                // check for array destructing with dotdotdot token on the left side of the assignment
                isArrayBindingPattern(node.name) && node.name.elements.some(element => {
                    if (isBindingElement(element)) {
                        return !!element.dotDotDotToken;
                    }
                    return false;
                })) {

                // array destructing with rest argument on the left side and no array literal on the right side
                // wrap the right expression with a table and to allow the array destructing class handle the assignment properly
                let expressionToParse: Expression = createArrayLiteral([node.initializer]);
                if (node.initializer.kind === SyntaxKind.ArrayLiteralExpression) {
                    expressionToParse = node.initializer;
                }
                right = expressionToParse;

                // add a modifier to destruct the wrapped element
                // @todo: implement array binding pattern
                // modifierStack.push(this.arrayBindingPatternModifierDestructWrappedElement.bind(this));

            } else if (
                // search for array destructing with array literal on the right side
                isArrayBindingPattern(node.name) && isArrayLiteralExpression(node.initializer)) {

                // elements should be outputed via multi return
                right = createTranspiledExpression(
                    node.initializer.elements
                        .map(element => this.transpiler.transpileNode(element))
                        .join(`,»`)
                );
            }
        }

        // check for default cases
        if (!left) {
            left = createIdentifier(this.transpiler.transpileNode(node.name));
        }
        if (!right) {
            if (node.initializer) {
                right = node.initializer;
            } else {
                right = createNull();
            }
        }

        // build the code stack
        const codeStack: string[] = [];

        // push the basic assignment
        codeStack.push(`local ${this.transpiler.transpileNode(createBinary(
            left,
            SyntaxKind.EqualsToken,
            right
        ), node)}`);

        // add possible assignment modifiers
        codeStack.push(...modifierStack.map(modifier => modifier(node)));

        // use a binary expression as variable declaration
        return codeStack.join(this.transpiler.break());
    }
}