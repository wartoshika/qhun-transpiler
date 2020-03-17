import { CallExpression } from "typescript";
import { AbstractSpecialHandler } from "../../../../transpiler/impl/AbstractSpecialHandler";

export class Lua51SpecialArrayFunction extends AbstractSpecialHandler<CallExpression> {

    private handlePush(node: CallExpression): string {

        return `@todo: array.push`;
    }

    private handleUnshift(node: CallExpression): string {

        return `@todo: array.unshift`;
    }
}