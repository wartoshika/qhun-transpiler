import { CallExpression } from "typescript";
import { AbstractSpecialHandler } from "../../../../transpiler/impl/AbstractSpecialHandler";

export class Lua51SpecialObjectFunction extends AbstractSpecialHandler<CallExpression> {

    protected handleKeys(node: CallExpression): string {

        return this.generateCallable(node, ["__a"], [
            `local __s»=»{»}`,
            `for __k,»_ in pairs(»__a») do`,
            this.transpiler.addIntend(`table.insert(»__s,»__k»)`),
            `end`,
            `return __s`
        ], { ignoreOwner: true });
    }

    protected handleValues(node: CallExpression): string {

        return this.generateCallable(node, ["__a"], [
            `local __s»=»{»}`,
            `for _,»__v in pairs(»__a») do`,
            this.transpiler.addIntend(`table.insert(»__s,»__v»)`),
            `end`,
            `return __s`
        ], { ignoreOwner: true });
    }

    protected handleHasOwnProperty(node: CallExpression): string {

        return this.generateCallable(node, ["__a", "__b"], [
            `for __k,»_ in pairs(»__a») do`,
            this.transpiler.addIntend(`if __k»==»__b then`),
            this.transpiler.addIntend(`return true`, 2),
            this.transpiler.addIntend(`end`),
            `end`,
            `return false`
        ]);
    }

}