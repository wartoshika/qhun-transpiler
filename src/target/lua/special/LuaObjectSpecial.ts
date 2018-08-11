import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaObjectSpecial extends BaseTarget, Target { }
export class LuaObjectSpecial {

    /**
     * transpiles a special object property access
     * @param node the node to transpile
     */
    public transpileSpecialObjectProperty(node: ts.PropertyAccessExpression): string {

        // get the name
        const name = this.transpileNode(node.name);

        // all object properties are currently unsupported!
        throw new UnsupportedError(`The given object property ${name} is unsupported!`, node);
    }

    /**
     * transpiles a special object function
     * @param name the name of the function
     * @param owner the owner or base object
     */
    public transpileSpecialObjectFunction(name: string, owner: string): string {
        switch (name) {
            case "keys":
                return this.transpileSpecialObjectFunctionKeys(owner);
            default:
                throw new UnsupportedError(`The given object function ${name} is unsupported!`, null);
        }
    }

    /**
     * an impl. for the Object.keys() function in lua
     * @param owner the owner or base object
     */
    private transpileSpecialObjectFunctionKeys(owner: string): string {

        return [
            `(function(___a)`,
            /**/`local keys = {}`,
            /**/`for k, _ in pairs(___a) do`,
            /**//**/`table.insert(keys, k)`,
            /**/`end`,
            /**/`return keys`,
            `end)`
        ].join(" ");
    }
}
