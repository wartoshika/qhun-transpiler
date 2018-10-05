import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaFunctionSpecial extends BaseTarget, Target { }
export class LuaFunctionSpecial {

    /**
     * transpiles a special function based function call
     * @param name the name of the function
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    public transpileSpecialFunctionFunction(name: string, owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        switch (name) {

            case "bind":
                return this.transpileSpecialFunctionBind(owner, argumentStack);
            default:
                throw new UnsupportedError(`The given method on the a function based object is not supported. Your method name was ${name}.`, null);
        }
    }

    /**
     * transpiles a function bind statement
     * @param owner the owner object
     * @param argumentStack the given arguments
     */
    private transpileSpecialFunctionBind(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        this.addDeclaration(
            "function.bind",
            [
                `local function __function_bind(fktn, boundArgs)`,
                this.addSpacesToString(`return function(...)`, 2),
                this.addSpacesToString(`for k,v in pairs({...}) do`, 4),
                this.addSpacesToString(`table.insert(boundArgs, v)`, 6),
                this.addSpacesToString(`end`, 4),
                this.addSpacesToString(`return fktn(unpack(boundArgs))`, 4),
                this.addSpacesToString(`end`, 2),
                `end`
            ].join("\n")
        );

        return `__function_bind(${owner}, {${argumentStack.map(this.transpileNode).join(", ")}})`;
    }

}
