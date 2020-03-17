import { CallExpression } from "typescript";
import { AbstractSpecialHandler } from "../../../../transpiler/impl/AbstractSpecialHandler";

export class Lua51SpecialStringFunction extends AbstractSpecialHandler<CallExpression> {

    protected handleToString(node: CallExpression): string {

        return `tostring»(»${this.getOwnerName(node)}»)`;
    }

    protected handleSplit(node: CallExpression): string {

        return this.generateCallable(node, ["a", "b"], [
            `local __result_»=»{»}`,
            `for __match in (»a»..»b»):gmatch(»"(.-)"»..»b»)»do`,
            this.transpiler.addIntend([
                `table.insert»(»__result,»__match»)`
            ].join(this.transpiler.break())),
            `end`,
            `return __result`
        ]);
    }

    protected handleReplace(node: CallExpression): string {

        return [
            `(»function»(»a,»b,»c»)`,
            this.transpiler.addIntend([
                `return string.gsub»(»a,»b,»c»)`,
            ].join(this.transpiler.break())),
            `end»)»(»${this.getOwnerName(node)},»${this.getTranspiledArguments(node)}»)`
        ].join(this.transpiler.break());
    }


}