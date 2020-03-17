import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { PropertyAccessExpression, TypeFlags } from "typescript";
import { NodeContainingException } from "../../../exception/NodeContainingException";
import { Lua51SpecialArrayProperty } from "./specialExpressions/Lua51SpecialArrayProperty";
import { UnsupportedNodeException } from "../../../exception/UnsupportedNodeException";
import { Lua51SpecialStringProperty } from "./specialExpressions/Lua51SpecialStringProperty";

export class Lua51PropertyAccessExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    private arrayProperty = new Lua51SpecialArrayProperty(this.transpiler);
    private stringProperty = new Lua51SpecialStringProperty(this.transpiler);

    /**
     * @inheritdoc
     */
    public propertyAccessExpression(node: PropertyAccessExpression): string {

        // get the base property name
        const name = this.transpiler.transpileNode(node.name);

        // get the expression by checking its type
        try {
            const expressionType = this.transpiler.typeHelper().getTypeChecker().getTypeAtLocation(node.expression);
            switch (expressionType.flags) {
                case TypeFlags.String:
                case TypeFlags.StringLiteral:
                    return this.transpileSpecialStringProperty(node);
                case TypeFlags.Object:

                    // check if this is an array
                    if (this.transpiler.typeHelper().isArray(node.expression)) {
                        return this.transpileSpecialArrayProperty(node);
                    }
            }

        } catch (e) {

            // type chould not be evaluated, use the default access pattern
            if (e instanceof NodeContainingException) {
                throw e;
            }
        }

        // use normal lua property access
        const expression = this.transpiler.transpileNode(node.expression);

        // append the name if the name is truethy
        if (name) {
            return `${expression}.${name}`;
        } else {
            return expression;
        }
    }

    /**
     * transpiles a special string property access
     * @param node the node to transpile
     */
    private transpileSpecialStringProperty(node: PropertyAccessExpression): string {

        // get the accessor name
        const name = this.transpiler.transpileNode(node.name);

        // look for special names
        return this.stringProperty.handle(name, node);
    }

    /**
     * transpiles a special array property access
     * @param node the node to transpile
     */
    private transpileSpecialArrayProperty(node: PropertyAccessExpression): string {

        // get the name
        const name = this.transpiler.transpileNode(node.name);

        // look for special names
        return this.arrayProperty.handle(name, node);
    }
}