import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";
import { LuaSpecialFunctions } from "./LuaSpecialFunctions";

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
     * @param argumentStack the argument stack
     */
    public transpileSpecialArrayFunction(name: string, owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {
        switch (name) {
            case "join":
                return this.transpileSpecialArrayFunctionJoin(owner, argumentStack);
            case "push":
                return this.transpileSpecialArrayFunctionPush(owner, argumentStack);
            case "forEach":
                return this.transpileSpecialArrayFunctionForEach(owner, argumentStack);
            case "some":
                return this.transpileSpecialArrayFunctionSome(owner, argumentStack);
            case "map":
                return this.transpileSpecialArrayFunctionMap(owner, argumentStack);
            case "filter":
                return this.transpileSpecialArrayFunctionFilter(owner, argumentStack);
            case "slice":
                return this.transpileSpecialArrayFunctionSlice(owner, argumentStack);
            case "unshift":
                return this.transpileSpecialArrayFunctionUnshift(owner, argumentStack);
            case "indexOf":
                return this.transpileSpecialArrayFunctionIndexOf(owner, argumentStack);
            case "splice":
                return this.transpileSpecialArrayFunctionSplice(owner, argumentStack);
            case "find":
                return this.transpileSpecialArrayFunctionFind(owner, argumentStack);
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
     * an impl. for the array.join function in lua
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    private transpileSpecialArrayFunctionJoin(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // declare the array.join method
        this.addDeclaration(
            "array.join",
            `local function __array_join(a, b) return table.concat(a, b) end`
        );

        return `__array_join(${owner}, ${argumentStack.map(this.transpileNode).join(", ")})`;
    }

    /**
     * an impl. for the array.push function in lua
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    private transpileSpecialArrayFunctionPush(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // declare the array.push method
        this.addDeclaration(
            "array.push",
            [
                `local function __array_push(array, ...)`,
                this.addSpacesToString(`for _, v in pairs({...}) do`, 2),
                this.addSpacesToString(`table.insert(array, v)`, 4),
                this.addSpacesToString(`end`, 2),
                this.addSpacesToString(`return #array`, 2),
                `end`
            ].join("\n")
        );

        return `__array_push(${owner}, ${argumentStack.map(this.transpileNode).join(", ")})`;
    }

    /**
     * an impl. for the array.forEach function in lua
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    private transpileSpecialArrayFunctionForEach(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // declare the array.forEach method
        this.addDeclaration(
            "array.foreach",
            [
                `local function __array_foreach(array, callback)`,
                this.addSpacesToString(`for k, v in pairs(array) do`, 2),
                this.addSpacesToString(`callback(v, k, array)`, 4),
                this.addSpacesToString(`end`, 2),
                `end`
            ].join("\n")
        );

        // resolve shorthand arguments
        const resolvedArguments = LuaSpecialFunctions.resolveShorthandCallback(argumentStack);

        return `__array_foreach(${owner}, ${resolvedArguments.map(this.transpileNode).join(", ")})`;
    }

    /**
     * an impl. for the array.map function in lua
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    private transpileSpecialArrayFunctionMap(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // declare the array.map method
        this.addDeclaration(
            "array.map",
            [
                `local function __array_map(array, callback, thisArg)`,
                this.addSpacesToString(`local newArray = {}`, 2),
                this.addSpacesToString(`for k, v in pairs(array) do`, 2),
                this.addSpacesToString(`table.insert(newArray, callback(v, k, array))`, 4),
                this.addSpacesToString(`end`, 2),
                this.addSpacesToString(`return newArray`, 2),
                `end`
            ].join("\n")
        );

        // resolve shorthand arguments
        const resolvedArguments = LuaSpecialFunctions.resolveShorthandCallback(argumentStack);

        return `__array_map(${owner}, ${resolvedArguments.map(this.transpileNode).join(", ")})`;
    }

    /**
     * an impl. for the array.filter function in lua
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    private transpileSpecialArrayFunctionFilter(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // declare the array.filter method
        this.addDeclaration(
            "array.filter",
            [
                `local function __array_filter(array, callback, thisArg)`,
                this.addSpacesToString(`local newArray = {}`, 2),
                this.addSpacesToString(`for k, v in pairs(array) do`, 2),
                this.addSpacesToString(`if callback(v, k, array) then`, 4),
                this.addSpacesToString(`table.insert(newArray, v)`, 6),
                this.addSpacesToString(`end`, 4),
                this.addSpacesToString(`end`, 2),
                this.addSpacesToString(`return newArray`, 2),
                `end`
            ].join("\n")
        );

        // resolve shorthand arguments
        const resolvedArguments = LuaSpecialFunctions.resolveShorthandCallback(argumentStack);

        return `__array_filter(${owner}, ${resolvedArguments.map(this.transpileNode).join(", ")})`;
    }

    /**
     * an impl. for the array.slice function in lua
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    private transpileSpecialArrayFunctionSlice(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // declare the array.filter method
        this.addDeclaration(
            "array.slice",
            [
                `local function __array_slice(array, begin, stop)`,
                this.addSpacesToString(`if type(begin) ~= "number" then begin = 1 end`, 2),
                this.addSpacesToString(`if type(stop) ~= "number" then stop = #array end`, 2),
                this.addSpacesToString(`local newArray = {}`, 2),
                this.addSpacesToString(`for k, v in pairs(array) do`, 2),
                this.addSpacesToString(`if begin >= 0 and k >= begin and k <= stop then`, 4),
                this.addSpacesToString(`table.insert(newArray, table.remove(array, k))`, 6),
                this.addSpacesToString(`end`, 4),
                this.addSpacesToString(`end`, 2),
                this.addSpacesToString(`return newArray`, 2),
                `end`
            ].join("\n")
        );

        // resolve shorthand arguments
        const resolvedArguments = LuaSpecialFunctions.resolveShorthandCallback(argumentStack);
        const stringArgs = resolvedArguments.map(this.transpileNode);

        // if there are no arguments, pass nil as argument
        if (stringArgs.length === 0) {
            stringArgs.push(this.transpileNode(ts.createNull()));
        }

        return `__array_slice(${owner}, ${stringArgs.join(",")})`;
    }

    /**
     * an impl. for the array.some function in lua
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    private transpileSpecialArrayFunctionSome(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // declare the array.filter method
        this.addDeclaration(
            "array.some",
            [
                `local function __array_some(array, predicate)`,
                this.addSpacesToString(`for k, v in pairs(array) do`, 2),
                this.addSpacesToString(`if predicate(v,k) == true then return true end`, 4),
                this.addSpacesToString(`end`, 2),
                this.addSpacesToString(`return false`, 2),
                `end`
            ].join("\n")
        );

        // resolve shorthand arguments
        const resolvedArguments = LuaSpecialFunctions.resolveShorthandCallback(argumentStack);
        const stringArgs = resolvedArguments.map(this.transpileNode);

        return `__array_some(${owner}, ${stringArgs.join(",")})`;
    }

    /**
     * an impl. for the array.unshift function in lua
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    private transpileSpecialArrayFunctionUnshift(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // declare the array.push method
        this.addDeclaration(
            "array.unshift",
            [
                `local function __array_unshift(array, ...)`,
                this.addSpacesToString(`for _, v in pairs({...}) do`, 2),
                this.addSpacesToString(`table.insert(array, 1, v)`, 4),
                this.addSpacesToString(`end`, 2),
                this.addSpacesToString(`return #array`, 2),
                `end`
            ].join("\n")
        );

        return `__array_unshift(${owner}, ${argumentStack.map(this.transpileNode).join(", ")})`;
    }

    /**
     * an impl. for the array.indexOf function in lua
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    private transpileSpecialArrayFunctionIndexOf(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // declare the array.push method
        this.addDeclaration(
            "array.indexof",
            [
                `local function __array_indexof(array, predicate)`,
                this.addSpacesToString(`for k, v in pairs(array) do`, 2),
                this.addSpacesToString(`if v == predicate then`, 4),
                this.addSpacesToString(`return k`, 6),
                this.addSpacesToString(`end`, 4),
                this.addSpacesToString(`end`, 2),
                this.addSpacesToString(`return -1`, 2),
                `end`
            ].join("\n")
        );

        return `__array_indexof(${owner}, ${argumentStack.map(this.transpileNode).join(", ")})`;
    }

    /**
     * an impl. for the array.indexOf function in lua
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    private transpileSpecialArrayFunctionSplice(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // declare the array.push method
        this.addDeclaration(
            "array.splice",
            [
                `local function __array_splice(array, index, delete, ...)`,
                this.addSpacesToString(`index = index or 1`, 2),
                this.addSpacesToString(`delete = delete or (#array - index)`, 2),
                this.addSpacesToString(`local newItems = {...}`, 2),
                this.addSpacesToString(`local i = 1`, 2),
                this.addSpacesToString(`local n`, 2),
                this.addSpacesToString(`local spliced = {}`, 2),
                this.addSpacesToString(`for _, v in pairs({...}) do`, 2),
                this.addSpacesToString(`if i == index then`, 4),
                this.addSpacesToString(`table.insert(spliced, v)`, 6),
                this.addSpacesToString(`table.remove(array, i)`, 6),
                this.addSpacesToString(`i = i - 1`, 6),
                this.addSpacesToString(`end`, 4),
                this.addSpacesToString(`i = i + 1`, 4),
                this.addSpacesToString(`end`, 2),
                this.addSpacesToString(`for _, v in pairs(newItems) do`, 2),
                this.addSpacesToString(`table.insert(array, index + n, v)`, 4),
                this.addSpacesToString(`n = n + 1`, 4),
                this.addSpacesToString(`end`, 2),
                this.addSpacesToString(`return spliced`, 2),
                `end`
            ].join("\n")
        );

        return `__array_splice(${owner}, ${argumentStack.map(this.transpileNode).join(", ")})`;
    }

    /**
     * an impl. for the array.find function in lua
     * @param owner the owner or base object
     * @param argumentStack the given arguments
     */
    private transpileSpecialArrayFunctionFind(owner: string, argumentStack: ts.NodeArray<ts.Expression>): string {

        // declare the array.push method
        this.addDeclaration(
            "array.find",
            [
                `local function __array_find(array, predicate)`,
                this.addSpacesToString(`for k, v in pairs(array) do`, 2),
                this.addSpacesToString(`if predicate(v, k, array) then`, 4),
                this.addSpacesToString(`return v`, 6),
                this.addSpacesToString(`end`, 4),
                this.addSpacesToString(`end`, 2),
                this.addSpacesToString(`return nil`, 2),
                `end`
            ].join("\n")
        );

        return `__array_find(${owner}, ${argumentStack.map(this.transpileNode).join(", ")})`;
    }
}
