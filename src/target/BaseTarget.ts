import { Target } from "./Target";
import * as ts from "typescript";
import { Project } from "../config/Project";
import { Types } from "../transpiler/Types";

declare type TypescriptExport = {
    name: string,
    node: ts.Node,
    isNamespaceExport?: boolean
};

/**
 * the base target class that implements cross language functionality
 */
export abstract class BaseTarget implements Partial<Target> {

    /**
     * the node transpiler
     */
    protected transpileNode: (node: ts.Node) => string;

    /**
     * a variable counter for truely unique vars
     */
    private uniqueVariableCounter: number = 0;

    /**
     * all declared exports of the file
     */
    private exportStack: TypescriptExport[] = [];

    /**
     * a stack of declarations that will be put onto the top of the
     */
    private declarationStack: {
        [uniqueName: string]: string
    } = {};

    constructor(
        protected project: Project,
        protected typeChecker: ts.TypeChecker
    ) { }

    /**
     * set the node transpiler function
     * @param func the node transpiler function
     */
    public setNodeTranspiler(func: (node: ts.Node) => string): void {
        this.transpileNode = func;
    }

    /**
     * get the node transpiler function
     */
    public getNodeTranspiler(): (node: ts.Node) => string {
        return this.transpileNode;
    }

    /**
     * get the declaration code that shoule be put to the head of the file
     */
    public getDeclaration(): string[] {

        return Object.keys(this.declarationStack)
            .map(key => this.declarationStack[key]);
    }

    /**
     * adds a declaration source code to the top of the file. this is a good place for used functions
     * @param name the unique name of the declaration
     * @param declaration the source code to declare
     */
    public addDeclaration(name: string, declaration: string): void {

        this.declarationStack[name] = declaration;
    }

    /**
     * put spaces before each statement in that string
     * @param str the string
     * @param spaces the number of spaces to add
     */
    public addSpacesToString(str: string, spaces: number): string {

        return str.split("\n")
            .map(line => new Array(spaces + 1).join(" ") + line)
            .join("\n");
    }

    /**
     * add a node export
     * @param name the name of the exported variable
     * @param node the node that should be exported
     * @param isNamespaceExport should be true for exports like export * from
     */
    protected addExport(name: string, node: ts.Node, isNamespaceExport: boolean = false): void {

        this.exportStack.push({
            name, node, isNamespaceExport
        });
    }

    /**
     * get all declared exports
     */
    protected getExports(): TypescriptExport[] {

        return this.exportStack;
    }

    /**
     * generate a unique variable that can be addressed locally
     * @param name the name of the variable
     */
    protected generateUniqueVariableName(name: string): string {

        return `__${name}_${this.uniqueVariableCounter++}`;
    }

    /**
     * removes the last new line char from the given string
     * @param str the string
     */
    protected removeLastNewLine(str: string): string {

        if (str[str.length - 1] === "\n") {
            str = str.substr(0, str.length - 1);
        }
        return str;
    }

    /**
     * remove leading and trailing single and double quotes from a string
     * @param str the string to remove the quotes from
     */
    protected removeQuotes(str: string): string {
        if (str[0] === `"` || str[0] === `'`) {
            return str.substr(1, str.length - 1);
        }
        return str;
    }

    /**
     * check if the given node has an export modifier
     * @param node the node to check
     */
    protected hasExportModifier(node: ts.Node): boolean {

        // forward Types function
        return Types.hasExportModifier(node, this.typeChecker);
    }

    /**
     * removes empty lines from the given string
     * @param str the string
     */
    protected removeEmptyLines(str: string): string {

        return str.split("\n").filter(line => !!(line.trim())).join("\n");
    }
}
