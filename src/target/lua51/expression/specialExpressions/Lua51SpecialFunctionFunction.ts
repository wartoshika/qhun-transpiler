import { CallExpression } from "typescript";
import { AbstractSpecialHandler } from "../../../../transpiler/impl/AbstractSpecialHandler";

export class Lua51SpecialFunctionFunction extends AbstractSpecialHandler<CallExpression> {

    protected handleBind(node: CallExpression): string {

        return this.generateCallable(node, ["__f, __p"], [
            `return function»(»...»)`,
            this.transpiler.addIntend(`for __k,»__v in pairs(»{»...»}») do`),
            this.transpiler.addIntend(`table.insert(__p, __v)`, 2),
            this.transpiler.addIntend(`end`),
            `return __f(»table.unpack(»__p»)»)`,
            `end`
        ], { argsAsObject: true, skipArgs: 1 });
    }

}