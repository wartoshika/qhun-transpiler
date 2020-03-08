import { PartialTranspiler } from "../../../../transpiler";
import { PropertyAccessExpression } from "typescript";

export class Lua51SpecialArrayFunction extends PartialTranspiler {

    public getSupport(): string[] {
        return ["push", "unshift"];
    }

    public arrayExpressionPush(node: PropertyAccessExpression): string {

        return `#${this.transpiler.transpileNode(node.expression)}`;
    }

    public arrayExpressionUnshift(node: PropertyAccessExpression): string {

        return `#${this.transpiler.transpileNode(node.expression)}`;
    }
}