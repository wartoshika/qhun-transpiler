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
     * @param argumentStack the argument stack
     */
    public transpileSpecialObjectFunction(name: string, owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // static Object.* test
        if (owner === "Object") {
            switch (name) {
                case "keys":
                    return this.transpileSpecialObjectFunctionKeys(owner, argumentStack);
                case "values":
                    return this.transpileSpecialObjectFunctionValues(owner, argumentStack);
                default:
                    throw new UnsupportedError(`The given object function ${name} is unsupported!`, null, true);
            }
        } else {

            // non static test
            switch (name) {
                case "hasOwnProperty":
                    return this.transpileSpecialObjectFunctionHasOwnProperty(owner, argumentStack);
                default:
                    throw new UnsupportedError(`The given object function ${name} is unsupported!`, null);
            }
        }
    }

    /**
     * an impl. for the Object.keys() function in lua
     * @param owner the owner
     * @param argumentStack the arguments
     */
    private transpileSpecialObjectFunctionKeys(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // declare object.keys
        this.addDeclaration(
            "object.keys",
            [
                `local function __object_keys(a)`,
                this.addSpacesToString(`local keys = {}`, 2),
                this.addSpacesToString(`for k, _ in pairs(a) do`, 2),
                this.addSpacesToString(`table.insert(keys, k)`, 4),
                this.addSpacesToString(`end`, 2),
                this.addSpacesToString(`return keys`, 2),
                `end`
            ].join("\n")
        );

        return `__object_keys(${argumentStack.map(this.transpileNode).join(", ")})`;
    }

    /**
     * an impl. for the Object.values() function in lua
     * @param owner the owner
     * @param argumentStack the arguments
     */
    private transpileSpecialObjectFunctionValues(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // declare object.keys
        this.addDeclaration(
            "object.values",
            [
                `local function __object_values(a)`,
                this.addSpacesToString(`local vals = {}`, 2),
                this.addSpacesToString(`for _, v in pairs(a) do`, 2),
                this.addSpacesToString(`table.insert(vals, v)`, 4),
                this.addSpacesToString(`end`, 2),
                this.addSpacesToString(`return vals`, 2),
                `end`
            ].join("\n")
        );

        return `__object_values(${argumentStack.map(this.transpileNode).join(", ")})`;
    }

    /**
     * an impl. for the Object.hasOwnProperty() function in lua
     * @param owner the owner
     * @param argumentStack the arguments
     */
    private transpileSpecialObjectFunctionHasOwnProperty(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // declare object.keys
        this.addDeclaration(
            "object.hasownproperty",
            [
                `local function __object_hasownproperty(a,b)`,
                this.addSpacesToString(`for k, _ in pairs(a) do`, 2),
                this.addSpacesToString(`if k == b then`, 4),
                this.addSpacesToString(`return true`, 6),
                this.addSpacesToString(`end`, 4),
                this.addSpacesToString(`end`, 2),
                this.addSpacesToString(`return false`, 2),
                `end`
            ].join("\n")
        );

        return `__object_hasownproperty(${owner}, ${argumentStack.map(this.transpileNode).join(", ")})`;
    }
}
