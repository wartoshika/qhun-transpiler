import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaStringSpecial extends BaseTarget, Target { }
export class LuaStringSpecial {

    /**
     * transpiles a special string property access
     * @param node the node to transpile
     */
    public transpileSpecialStringProperty(node: ts.PropertyAccessExpression): string {

        // get the accessor name
        const name = this.transpileNode(node.name);

        // look for special names
        switch (name) {
            case "length":
                return this.transpileSpecialStringPropertyLength(node);
            default:
                throw new UnsupportedError(`The given string property ${name} is unsupported!`, node);
        }
    }

    /**
     * transpiles a special string function
     * @param name the name of the function
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    public transpileSpecialStringFunction(name: string, owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {
        switch (name) {
            case "replace":
                return this.transpileSpecialStringFunctionReplace(owner, argumentStack);
            case "split":
                return this.transpileSpecialStringFunctionSplit(owner, argumentStack);
            case "substr":
                return this.transpileSpecialStringFunctionSubstr(owner, argumentStack);
            case "trim":
                return this.transpileSpecialStringFunctionTrim(owner, argumentStack);
            default:
                throw new UnsupportedError(`The given string function ${name} is unsupported!`, null);
        }
    }

    /**
     * transpiles a string.length into lua
     * @param node the node to transpile
     */
    private transpileSpecialStringPropertyLength(node: ts.PropertyAccessExpression): string {

        return `string.len(${this.transpileNode(node.expression)})`;
    }

    /**
     * an impl. for the string.replace function in lua
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    private transpileSpecialStringFunctionReplace(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // add declaration
        this.addDeclaration(
            "string.replace",
            [
                `local function __string_replace(a,b,c)`,
                this.addSpacesToString(`return string.gsub(a,b,c)`, 2),
                `end`
            ].join("\n")
        );

        return `__string_replace(${owner}, ${argumentStack.map(this.transpileNode).join(", ")})`;
    }

    /**
     * an impl. for the string.split function in lua
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    private transpileSpecialStringFunctionSplit(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // add declaration
        this.addDeclaration(
            "string.split",
            [
                `local function __string_split(a,b)`,
                this.addSpacesToString(`result = {}`, 2),
                this.addSpacesToString(`for match in (a..b):gmatch("(.-)"..b) do`, 2),
                this.addSpacesToString(`table.insert(result, match)`, 4),
                this.addSpacesToString(`end`, 2),
                this.addSpacesToString(`return result`, 2),
                `end`
            ].join("\n")
        );

        return `__string_split(${owner}, ${argumentStack.map(this.transpileNode).join(", ")})`;
    }

    /**
     * an impl. for the string.substr function in lua
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    private transpileSpecialStringFunctionSubstr(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // add declaration
        this.addDeclaration(
            "string.substr",
            [
                `local function __string_substr(a,b,c)`,
                this.addSpacesToString(`return string.sub(a, b, c)`, 2),
                `end`
            ].join("\n")
        );

        return `__string_substr(${owner}, ${argumentStack.map(this.transpileNode).join(", ")})`;
    }

    /**
     * an impl. for the string.trim function in lua
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    private transpileSpecialStringFunctionTrim(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // add declaration
        this.addDeclaration(
            "string.trim",
            [
                `local function __string_trim(a)`,
                this.addSpacesToString(`return string.gsub(a, "^%s*(.-)%s*$", "%1")`, 2),
                `end`
            ].join("\n")
        );

        return `__string_trim(${owner})`;
    }
}
