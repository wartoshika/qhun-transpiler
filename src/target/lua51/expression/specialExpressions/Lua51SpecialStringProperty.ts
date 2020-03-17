import { PropertyAccessExpression } from "typescript";
import { AbstractSpecialHandler } from "../../../../transpiler/impl/AbstractSpecialHandler";

export class Lua51SpecialStringProperty extends AbstractSpecialHandler<PropertyAccessExpression> {

    protected handleLength(node: PropertyAccessExpression): string {

        return `string.len(${this.transpiler.space()}${this.transpiler.transpileNode(node.expression)}${this.transpiler.space()})`;
    }
}