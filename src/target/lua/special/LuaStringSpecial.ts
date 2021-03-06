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
            case "charAt":
                return this.transpileSpecialStringFunctionCharAt(owner, argumentStack);
            case "toLowerCase":
                return this.transpileSpecialStringFunctionLowerCase(owner, argumentStack);
            case "toUpperCase":
                return this.transpileSpecialStringFunctionUpperCase(owner, argumentStack);
            case "match":
                return this.transpileSpecialStringFunctionMatch(owner, argumentStack);
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

    /**
     * an impl. for the string.charAt function in lua
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    private transpileSpecialStringFunctionCharAt(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // add declaration
        this.addDeclaration(
            "string.charat",
            [
                `local function __string_char_at(a, b)`,
                this.addSpacesToString(`return string.byte(a, tonumber(b) + 1)`, 2),
                `end`
            ].join("\n")
        );

        return `__string_char_at(${owner}, ${argumentStack.map(this.transpileNode).join(", ")})`;
    }

    /**
     * an impl. for the string.toLowerCase function in lua
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    private transpileSpecialStringFunctionLowerCase(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // add declaration
        this.addDeclaration(
            "string.lower",
            [
                `local function __string_lower(a)`,
                this.addSpacesToString(`return string.lower(a)`, 2),
                `end`
            ].join("\n")
        );

        return `__string_lower(${owner})`;
    }

    /**
     * an impl. for the string.toUpperCase function in lua
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    private transpileSpecialStringFunctionUpperCase(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // add declaration
        this.addDeclaration(
            "string.upper",
            [
                `local function __string_upper(a)`,
                this.addSpacesToString(`return string.upper(a)`, 2),
                `end`
            ].join("\n")
        );

        return `__string_upper(${owner})`;
    }

    /**
     * an impl. for the string.match function in lua
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    private transpileSpecialStringFunctionMatch(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // add declaration
        this.addDeclaration(
            "string.match",
            [
                `local function __string_match(s,p)`,
                this.addSpacesToString(`local match = {string.match(s, p)}`, 2),
                this.addSpacesToString(`if #match <= 0 then return nil end`, 2),
                this.addSpacesToString(`local matchList = {}`, 2),
                this.addSpacesToString(`for i = 1, #match do`, 2),
                this.addSpacesToString(`if i%2 == 1 then`, 4),
                this.addSpacesToString(`table.insert(matchList, match[i])`, 6),
                this.addSpacesToString(`end`, 4),
                this.addSpacesToString(`end`, 2),
                this.addSpacesToString(`return matchList`, 2),
                `end`
            ].join("\n")
        );

        return `__string_match(${owner}, ${argumentStack.map(this.transpileNode).join(", ")})`;
    }
}
