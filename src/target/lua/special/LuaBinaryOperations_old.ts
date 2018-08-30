import { Target } from "../../Target";
import { BaseTarget } from "../../BaseTarget";

enum LuaBinaryOperationsFunctionsInternal {
    MEMOIZE = "__bitop_memoize",
    MAKE_UNCACHED = "__bitop_makeuncached",
    MAKE = "__bitop_make"
}

export enum LuaBinaryOperationsFunctions {
    AND = "__bitop_and",
    OR = "__bitop_or",
    XOR = "__bitop_xor",
    NOT = "__bitop_not"
}

// special thanks to: https://github.com/AlberTajuelo/bitop-lua
export class LuaBinaryOperations {

    private mod: number = 2 ^ 32;
    private modm: number = this.mod - 1;

    /**
     * declare all functions that are nessesary to use the given function
     * @param binaryFunction the function name
     */
    public declareFunctionsFor(binaryFunction: LuaBinaryOperationsFunctions, target: BaseTarget): void {

        // get dependencies
        const dependencyStack: ((t: BaseTarget) => void)[] = [
            this.declareMemoize,
            this.declareMakeUncached,
            this.declareMake
        ];
        switch (binaryFunction) {
            case LuaBinaryOperationsFunctions.AND:
                dependencyStack.push(...[
                    this.declareXor,
                    this.declareAnd
                ]);
                break;
            case LuaBinaryOperationsFunctions.NOT:
                dependencyStack.push(...[
                    this.declareNot
                ]);
                break;
            case LuaBinaryOperationsFunctions.OR:
                dependencyStack.push(...[
                    this.declareXor,
                    this.declareAnd,
                    this.declareOr
                ]);
                break;
            case LuaBinaryOperationsFunctions.XOR:
                dependencyStack.push(...[
                    this.declareXor
                ]);
                break;
        }

        // declare dependencies
        dependencyStack.forEach(dep => dep.bind(this)(target));
    }

    /**
     * declare the bitop memoize function
     * @param target the target to declare the function on
     */
    private declareMemoize(target: BaseTarget): void {

        target.addDeclaration(
            "bitop.memoize",
            [
                `local function ${LuaBinaryOperationsFunctionsInternal.MEMOIZE}(f)`,
                target.addSpacesToString(`local mt = {}`, 2),
                target.addSpacesToString(`local t = setmetatable({}, mt)`, 2),
                target.addSpacesToString(`function mt:__index(k)`, 2),
                target.addSpacesToString(`local v = f(k)`, 4),
                target.addSpacesToString(`t[k] = v`, 4),
                target.addSpacesToString(`return v`, 4),
                target.addSpacesToString(`end`, 2),
                target.addSpacesToString(`return t`, 2),
                `end`
            ].join("\n")
        );
    }

    /**
     * declare the bitop make uncached function
     * @param target the target to declare the function on
     */
    private declareMakeUncached(target: BaseTarget): void {

        target.addDeclaration(
            "bitop.makeuncached",
            [
                `local function ${LuaBinaryOperationsFunctionsInternal.MAKE_UNCACHED}(t, m)`,
                target.addSpacesToString(`local function bitop(a, b)`, 2),
                target.addSpacesToString(`local res,p = 0,1`, 4),
                target.addSpacesToString(`while a ~= 0 and b ~= 0 do`, 4),
                target.addSpacesToString(`local am, bm = a%m, b%m`, 6),
                target.addSpacesToString(`res = res + t[am][bm]*p`, 6),
                target.addSpacesToString(`a = (a - am) / m`, 6),
                target.addSpacesToString(`b = (b - bm) / m`, 6),
                target.addSpacesToString(`p = p*m`, 6),
                target.addSpacesToString(`end`, 4),
                target.addSpacesToString(`res = res + (a+b) * p`, 4),
                target.addSpacesToString(`return res`, 4),
                target.addSpacesToString(`end`, 2),
                target.addSpacesToString(`return bitop`, 2),
                `end`
            ].join("\n")
        );
    }

    /**
     * declare the bitop make function
     * @param target the target to declare the function on
     */
    private declareMake(target: BaseTarget): void {

        target.addDeclaration(
            "bitop.make",
            [
                `local function ${LuaBinaryOperationsFunctionsInternal.MAKE}(t)`,
                target.addSpacesToString(`local op1 = ${LuaBinaryOperationsFunctionsInternal.MAKE_UNCACHED}(t, 2^1)`, 2),
                target.addSpacesToString(`local op2 = ${LuaBinaryOperationsFunctionsInternal.MEMOIZE}(function(a)`, 2),
                target.addSpacesToString(`return ${LuaBinaryOperationsFunctionsInternal.MEMOIZE}(function(b)`, 4),
                target.addSpacesToString(`return op1(a, b)`, 6),
                target.addSpacesToString(`end)`, 4),
                target.addSpacesToString(`end)`, 2),
                target.addSpacesToString(`return ${LuaBinaryOperationsFunctionsInternal.MAKE_UNCACHED}(op2, 2^(t.n or 1))`, 2),
                `end`
            ].join("\n")
        );
    }

    /**
     * declare the bitop xor function
     * @param target the target to declare the function on
     */
    private declareXor(target: BaseTarget): void {

        target.addDeclaration(
            "bitop.xor",
            `local ${LuaBinaryOperationsFunctions.XOR} = ${LuaBinaryOperationsFunctionsInternal.MAKE} {[0]={[0]=0,[1]=1},[1]={[0]=1,[1]=0}, n=4}`
        );
    }

    /**
     * declare the bitop and function
     * @param target the target to declare the function on
     */
    private declareAnd(target: BaseTarget): void {

        target.addDeclaration(
            "bitop.and",
            [
                `function ${LuaBinaryOperationsFunctions.AND}(a, b)`,
                target.addSpacesToString(`return ((a+b)-${LuaBinaryOperationsFunctions.XOR}(a,b))/2`, 2),
                `end`
            ].join("\n")
        );
    }

    /**
     * declare the bitop or function
     * @param target the target to declare the function on
     */
    private declareOr(target: BaseTarget): void {

        target.addDeclaration(
            "bitop.or",
            [
                `function ${LuaBinaryOperationsFunctions.OR}(a, b)`,
                target.addSpacesToString(`return ${this.modm}-${LuaBinaryOperationsFunctions.AND}(${this.modm}-a, ${this.modm}-b)`, 2),
                `end`
            ].join("\n")
        );
    }

    /**
     * declare the bitop not function
     * @param target the target to declare the function on
     */
    private declareNot(target: BaseTarget): void {

        target.addDeclaration(
            "bitop.not",
            [
                `function ${LuaBinaryOperationsFunctions.NOT}(a)`,
                target.addSpacesToString(`return ${this.modm}-a)`, 2),
                `end`
            ].join("\n")
        );
    }
}
