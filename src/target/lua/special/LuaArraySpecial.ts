import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaArraySpecial extends BaseTarget, Target { }
export class LuaArraySpecial {

    /**
     * transpiles a special array property access
     * @param node the node to transpile
     */
    public transpileSpecialArrayProperty(node: ts.PropertyAccessExpression): string {

        // get the name
        const name = this.transpileNode(node.name);

        // look for special names
        switch (name) {
            case "length":
                return this.transpileSpecialArrayPropertyLength(node);
            default:
                throw new UnsupportedError(`The given array property ${name} is unsupported!`, node);
        }
    }

    /**
     * transpiles a special array function
     * @param name the name of the function
     * @param owner the owner or base object
     */
    public transpileSpecialArrayFunction(name: string, owner: string): string {
        switch (name) {
            case "join":
                return this.transpileSpecialArrayFunctionJoin(owner);
            case "push":
                return this.transpileSpecialArrayFunctionPush(owner);
            default:
                throw new UnsupportedError(`The given array function ${name} is unsupported!`, null);
        }
    }

    /**
     * transpiles an array.length into lua
     * @param node the node to transpile
     */
    private transpileSpecialArrayPropertyLength(node: ts.PropertyAccessExpression): string {

        return `#${this.transpileNode(node.expression)}`;
    }

    /**
     * an impl. for the string.replace function in lua
     * @param owner the owner or base object
     */
    private transpileSpecialArrayFunctionJoin(owner: string): string {

        return `(function(___a) return table.concat(${owner}, ___a) end)`;
    }

    /**
     * an impl. for the string.push function in lua
     * @param owner the owner or base object
     */
    private transpileSpecialArrayFunctionPush(owner: string): string {

        return `(function(...) local ___v = {...} for _, ___e in pairs(___v) do table.insert(${owner}, ___e) end end)`;
    }
}
