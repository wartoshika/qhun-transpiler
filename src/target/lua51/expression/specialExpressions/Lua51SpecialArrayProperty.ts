import { PartialTranspiler } from "../../../../transpiler";
import { PropertyAccessExpression } from "typescript";

export class Lua51SpecialArrayProperty extends PartialTranspiler {

    public getSupport(): string[] {
        return ["length"];
    }

    public arrayExpressionLength(node: PropertyAccessExpression): string {

        return `#${this.transpiler.transpileNode(node.expression)}`;
    }
}