import { CallExpression } from "typescript";
import { AbstractSpecialHandler } from "../../../../transpiler/impl/AbstractSpecialHandler";

export class Lua51SpecialStringFunction extends AbstractSpecialHandler<CallExpression> {

    protected handleToString(node: CallExpression): string {

        return `tostring»(»${this.getOwnerName(node)}»)`;
    }

    protected handleSplit(node: CallExpression): string {

        return this.generateCallable(node, ["__a", "__b"], [
            `local __result»=»{»}`,
            `for __match in (»__a»..»__b»):gmatch(»"(.-)"»..»__b»)»do`,
            this.transpiler.addIntend([
                `table.insert»(»__result,»__match»)`
            ].join(this.transpiler.break())),
            `end`,
            `return __result`
        ]);
    }

    protected handleReplace(node: CallExpression): string {

        return this.generateCallable(node, ["__a", "__b", "__c"], [
            `return string.gsub»(»__a,»__b,»__c»)`
        ]);
    }

    protected handleSubstr(node: CallExpression): string {

        return this.generateCallable(node, ["__a", "__b", "__c"], [
            `return string.sub»(»__a,»__b,»__c»)`
        ]);
    }

    protected handleTrim(node: CallExpression): string {

        return this.generateCallable(node, ["__a"], [
            `return string.gsub»(»__a,»"^%s*(.-)%s*$",»"%1"»)`
        ]);
    }

    protected handleCharAt(node: CallExpression): string {

        return this.generateCallable(node, ["__a", "__b"], [
            `return string.byte»(»__a,»tonumber»(»__b»)»+»1»)`
        ]);
    }

    protected handleToLowerCase(node: CallExpression): string {

        return this.generateCallable(node, ["__a"], [
            `return string.lower»(»__a»)`
        ]);
    }

    protected handleToUpperCase(node: CallExpression): string {

        return this.generateCallable(node, ["__a"], [
            `return string.upper»(»__a»)`
        ]);
    }

    protected handleJoin(node: CallExpression): string {

        return this.generateCallable(node, ["__a", "__c"], [
            `return table.concat»(»__a,»__c»)`
        ]);
    }

    protected handleMatch(node: CallExpression): string {

        this.transpiler.registerWarning({
            node: node,
            message: "String.match is experimental only!"
        });

        return this.generateCallable(node, ["__s", "__p"], [
            `local __match»=»{»string.match»(»__s,»__p»)»}`,
            `if #__match»<=»0 then return nil end`,
            `local __matchList»=»{»}`,
            `for __i»=»1,»#__match do`,
            this.transpiler.addIntend(`if i%2»==»1 then`),
            this.transpiler.addIntend(`table.insert»(»__matchList,»__match[»__i»]»)`, 2),
            this.transpiler.addIntend(`end`),
            `end`,
            `return __matchList`
        ]);
    }

    protected handleRepeat(node: CallExpression): string {

        return this.generateCallable(node, ["__s", "__a"], [
            `return string.rep»(»__s,»__a»)`
        ]);
    }

}