import { PropertyAccessExpression } from "typescript";
import { AbstractSpecialHandler } from "../../../../transpiler/impl/AbstractSpecialHandler";

export class Lua51SpecialArrayProperty extends AbstractSpecialHandler<PropertyAccessExpression> {

    protected handleLength(node: PropertyAccessExpression): string {

        return `#${this.transpiler.transpileNode(node.expression)}`;
    }
}