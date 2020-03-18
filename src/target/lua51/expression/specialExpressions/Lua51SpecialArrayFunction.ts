import { CallExpression, createNull } from "typescript";
import { AbstractSpecialHandler } from "../../../../transpiler/impl/AbstractSpecialHandler";

export class Lua51SpecialArrayFunction extends AbstractSpecialHandler<CallExpression> {

    protected handleJoin(node: CallExpression): string {

        return this.generateCallable(node, ["__a", "__b"], [
            `return table.concat»(»__a,»__b»)`
        ]);
    }

    protected handlePush(node: CallExpression): string {

        return this.generateCallable(node, ["__a", "..."], [
            `for _, __v in pairs(»{»...»}») do`,
            this.transpiler.addIntend(`table.insert»(»__a,»__v»)`),
            `end`,
            `return #__a`
        ]);
    }

    protected handleUnshift(node: CallExpression): string {

        return this.generateCallable(node, ["__a", "..."], [
            `for __i,»__v in pairs(»{»...»}») do`,
            this.transpiler.addIntend(`table.insert»(»__a,»__i»,»__v)`),
            `end`,
            `return #__a`
        ]);
    }

    protected handleForEach(node: CallExpression): string {

        return this.generateCallable(node, ["__a", "__c"], [
            `for __k,»__v in pairs(»__a») do`,
            this.transpiler.addIntend(`__c»(»__v,»__k,»__a»)`),
            `end`
        ]);
    }

    protected handleMap(node: CallExpression): string {

        return this.generateCallable(node, ["__a", "__c", "__t"], [
            `local __n»=»{»}`,
            `for __k,»__v in pairs(»__a») do`,
            this.transpiler.addIntend(`table.insert»(»__n,»__c»(»__v,»__k,»__a»)»)`),
            `end`,
            `return __n`
        ]);
    }

    protected handleFilter(node: CallExpression): string {

        return this.generateCallable(node, ["__a", "__p", "__t"], [
            `local __n»=»{»}`,
            `for __k,»__v in pairs(»__a») do`,
            this.transpiler.addIntend(`if __p»(»__v,»__k,»__a») then`),
            this.transpiler.addIntend(`table.insert»(»__n,»__v»)`, 2),
            this.transpiler.addIntend(`end`),
            `end`,
            `return __n`
        ]);
    }

    protected handleSlice(node: CallExpression): string {

        return this.generateCallable(node, ["__a", "__b", "__s"], [
            `if type(__b)»~=»"number" then __b»=»1 end`,
            `if type(__s)»~=»"number" then __s»=»#__a end`,
            `local __n»=»{»}`,
            `for __k,»__v in pairs(»__a») do`,
            this.transpiler.addIntend(`if __b»>=»0 and __k»>=»__b and __k»<=»__s then`),
            this.transpiler.addIntend(`table.insert»(»__n,»__a[»__k»]»)`, 2),
            this.transpiler.addIntend(`end`),
            `end`,
            `return __n`
        ], { defaultArgumentsWhenEmpty: this.transpiler.transpileNode(createNull()) });
    }

    protected handleSome(node: CallExpression): string {

        return this.generateCallable(node, ["__a", "__p"], [
            `for __k,»__v in pairs(»__a») do`,
            this.transpiler.addIntend(`if __p(»__v,»__k»)»==»true then return true end`),
            `end`,
            `return false`
        ]);
    }

    protected handleEvery(node: CallExpression): string {

        return this.generateCallable(node, ["__a", "__p"], [
            `local __c»=»true`,
            `for __k,»__v in pairs(»__a») do`,
            this.transpiler.addIntend(`__c»=»__c and __p(»__v,»__k»)`),
            this.transpiler.addIntend(`if not __c then`),
            this.transpiler.addIntend(`return false`, 2),
            this.transpiler.addIntend(`end`),
            `end`,
            `return __c`
        ]);
    }

    protected handleIndexOf(node: CallExpression): string {

        return this.generateCallable(node, ["__a", "__p"], [
            `for __k,»__v in pairs(»__a») do`,
            this.transpiler.addIntend(`if __v»==__p then`),
            this.transpiler.addIntend(`return __k`, 2),
            this.transpiler.addIntend(`end`),
            `end`,
            `return -1`
        ]);
    }

    protected handleSplice(node: CallExpression): string {

        return this.generateCallable(node, ["__a", "__i", "__d", "..."], [
            `__i»=»__i or 1`,
            `__d»=»__d or (»#__a»-»__i»)`,
            `local __n»=»{»}`,
            `local __q»=»1`,
            `local __r»=»1`,
            `local __u»=»{»}`,
            `for _,»__v in pairs(»{»...»}») do`,
            this.transpiler.addIntend(`if __q»==»__i then`),
            this.transpiler.addIntend(`table.insert»(»__u,»__v»)`, 2),
            this.transpiler.addIntend(`table.remove»(»__a,»__q»)`, 2),
            this.transpiler.addIntend(`__q»=»__q»-»1`, 2),
            this.transpiler.addIntend(`end`),
            this.transpiler.addIntend(`__q»=»__q»+»1`),
            this.transpiler.addIntend(`end`),
            `for _,»__v in pairs(»__n») do`,
            this.transpiler.addIntend(`table.insert(»__a,»__i»+»__r,»__v»)`),
            this.transpiler.addIntend(`__r»=»__r»+»1`),
            `end`,
            `return __u`
        ]);
    }

    protected handleFind(node: CallExpression): string {

        return this.generateCallable(node, ["__a", "__p"], [
            `for __k,»__v in pairs(»__a») do`,
            this.transpiler.addIntend(`if __p(»__v,»__k»)»==»true then return __v end`),
            `end`,
            `return nil`
        ]);
    }

}