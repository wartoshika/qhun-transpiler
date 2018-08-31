import { BaseTarget } from "../../BaseTarget";

enum LuaBinaryOperationsFunctionsInternal {
    TO_BITTABLE_R = "__bitop_to_bittable_r",
    TO_BITTABLE = "__bitop_to_bittable",
    MAKEOP = "__bitop_make_op",
    BITCALC = "__bitop_bitcalc"
}

export enum LuaBinaryOperationsFunctions {
    AND = "__bitop_and",
    OR = "__bitop_or",
    XOR = "__bitop_xor",
    NOT = "__bitop_not"
}

// special thanks to: https://gist.github.com/kaeza/8ee7e921c98951b4686d
export class LuaBinaryOperations {

    /**
     * declare all functions that are nessesary to use the given function
     * @param binaryFunction the function name
     */
    public declareFunctionsFor(binaryFunction: LuaBinaryOperationsFunctions, target: BaseTarget): void {

        // get dependencies
        const dependencyStack: ((t: BaseTarget) => void)[] = [
            this.declareToBittableR,
            this.declareToBittable,
            this.declareMakeOp,
            this.declareBitcalc
        ];
        switch (binaryFunction) {
            case LuaBinaryOperationsFunctions.AND:
                dependencyStack.push(...[
                    this.declareAnd
                ]);
                break;
            case LuaBinaryOperationsFunctions.NOT:
                dependencyStack.push(...[
                    this.declareXor,
                    this.declareNot
                ]);
                break;
            case LuaBinaryOperationsFunctions.OR:
                dependencyStack.push(...[
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
     * declare the bitop to bittable r function
     * @param target the target to declare the function on
     */
    private declareToBittableR(target: BaseTarget): void {

        target.addDeclaration(
            "bitop.tobittabler",
            [
                `local function ${LuaBinaryOperationsFunctionsInternal.TO_BITTABLE_R}(x, ...)`,
                target.addSpacesToString(`if (x or 0) == 0 then return ... end`, 2),
                target.addSpacesToString(`return ${LuaBinaryOperationsFunctionsInternal.TO_BITTABLE_R}(math.floor(x/2), x%2, ...)`, 2),
                `end`
            ].join("\n")
        );
    }

    /**
     * declare the to bittable function
     * @param target the target to declare the function on
     */
    private declareToBittable(target: BaseTarget): void {

        target.addDeclaration(
            "bitop.tobittable",
            [
                `local function ${LuaBinaryOperationsFunctionsInternal.TO_BITTABLE}(x)`,
                target.addSpacesToString(`if x == 0 then return { 0 } end`, 2),
                target.addSpacesToString(`return { ${LuaBinaryOperationsFunctionsInternal.TO_BITTABLE_R}(x) }`, 2),
                `end`
            ].join("\n")
        );
    }

    /**
     * declare the make op function
     * @param target the target to declare the function on
     */
    private declareMakeOp(target: BaseTarget): void {

        target.addDeclaration(
            "bitop.makeop",
            [
                `local function ${LuaBinaryOperationsFunctionsInternal.MAKEOP}(cond)`,
                target.addSpacesToString(`local function oper(x, y, ...)`, 2),
                target.addSpacesToString(`if not y then return x end`, 4),
                target.addSpacesToString(`x, y = ${LuaBinaryOperationsFunctionsInternal.TO_BITTABLE}(x), ${LuaBinaryOperationsFunctionsInternal.TO_BITTABLE}(y)`, 4),
                target.addSpacesToString(`local xl, yl = #x, #y`, 4),
                target.addSpacesToString(`local t, tl = { }, math.max(xl, yl)`, 4),
                target.addSpacesToString(`for i = 0, tl-1 do`, 4),
                target.addSpacesToString(`local b1, b2 = x[xl-i], y[yl-i]`, 6),
                target.addSpacesToString(`if not (b1 or b2) then break end`, 6),
                target.addSpacesToString(`t[tl-i] = (cond((b1 or 0) ~= 0, (b2 or 0) ~= 0) and 1 or 0)`, 6),
                target.addSpacesToString(`end`, 4),
                target.addSpacesToString(`return oper(tonumber(table.concat(t), 2), ...)`, 4),
                target.addSpacesToString(`end`, 2),
                target.addSpacesToString(`return oper`, 2),
                `end`
            ].join("\n")
        );
    }

    /**
     * declare the bitcalc function that can count the number of used bytes
     * @param target the target to declare the function on
     */
    private declareBitcalc(target: BaseTarget): void {

        target.addDeclaration(
            "bitop.bitcalc",
            [
                `local function ${LuaBinaryOperationsFunctionsInternal.BITCALC}(a)`,
                target.addSpacesToString(`local r = table.concat(${LuaBinaryOperationsFunctionsInternal.TO_BITTABLE}(x))`, 2),
                target.addSpacesToString(`local b = ("0"):rep(1-#r)..r`, 2),
                target.addSpacesToString(`return b:len()`, 2),
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
            `local ${LuaBinaryOperationsFunctions.XOR} = ${LuaBinaryOperationsFunctionsInternal.MAKEOP}(function(a, b) return a ~= b end)`
        );
    }

    /**
     * declare the bitop and function
     * @param target the target to declare the function on
     */
    private declareAnd(target: BaseTarget): void {

        target.addDeclaration(
            "bitop.and",
            `local ${LuaBinaryOperationsFunctions.AND} = ${LuaBinaryOperationsFunctionsInternal.MAKEOP}(function(a, b) return a and b end)`
        );
    }

    /**
     * declare the bitop or function
     * @param target the target to declare the function on
     */
    private declareOr(target: BaseTarget): void {

        target.addDeclaration(
            "bitop.or",
            `local ${LuaBinaryOperationsFunctions.OR} = ${LuaBinaryOperationsFunctionsInternal.MAKEOP}(function(a, b) return a or b end)`
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
                target.addSpacesToString(`return ${LuaBinaryOperationsFunctions.XOR}(a, 2^${LuaBinaryOperationsFunctionsInternal.BITCALC}(a)-1)`, 2),
                `end`
            ].join("\n")
        );
    }
}
