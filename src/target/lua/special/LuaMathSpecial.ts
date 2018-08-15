import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaMathSpecial extends BaseTarget, Target { }
export class LuaMathSpecial {

    /**
     * transpiles a special string function
     * @param name the name of the function
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    public transpileSpecialMathFunction(name: string, owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // check if the given function is supported
        const lowerFunctionName = name.toLowerCase();
        if (this.getSupportedLuaMathFunctionNames().indexOf(lowerFunctionName) === -1) {
            throw new UnsupportedError(`The given function Math.${name} is not supported!`, null);
        }

        // use the same name with same arguments to transpile the request
        return `math.${lowerFunctionName}(${argumentStack.map(this.transpileNode).join(", ")})`;
    }

    /**
     * get all supported math function names
     */
    private getSupportedLuaMathFunctionNames(): string[] {
        return [
            "abs", "acos", "asin", "atan", "ceil", "cos",
            "deg", "exp", "floor", "modf", "huge", "log",
            "max", "maxinteger", "min", "mininteger", "modf",
            "pi", "rad", "random", "randomseed", "sin", "sqrt",
            "tan", "tointeger", "type", "ult"
        ];
    }
}
