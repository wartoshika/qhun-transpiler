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
            case "map":
                return this.transpileSpecialArrayFunctionMap(owner, argumentStack);
            case "filter":
                return this.transpileSpecialArrayFunctionFilter(owner, argumentStack);
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
        const resolvedArguments = LuaSpecialFunctions.resolveShorthandCallback(argumentStack, this.typeChecker);

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
        const resolvedArguments = LuaSpecialFunctions.resolveShorthandCallback(argumentStack, this.typeChecker);

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
        const resolvedArguments = LuaSpecialFunctions.resolveShorthandCallback(argumentStack, this.typeChecker);

        return `__array_filter(${owner}, ${resolvedArguments.map(this.transpileNode).join(", ")})`;
    }
}
