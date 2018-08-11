import { Target } from "./Target";
import * as ts from "typescript";
import { Project } from "../config/Project";

/**
 * the base target class that implements cross language functionality
 */
export abstract class BaseTarget implements Partial<Target> {

    /**
     * the node transpiler
     */
    protected transpileNode: (node: ts.Node) => string;

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
     * put spaces before each statement in that string
     * @param str the string
     * @param spaces the number of spaces to add
     */
    protected addSpacesToString(str: string, spaces: number): string {

        return str.split("\n")
            .map(line => new Array(spaces + 1).join(" ") + line)
            .join("\n");
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

        return node.modifiers && node.modifiers.some((x) => x.kind === ts.SyntaxKind.ExportKeyword);
    }

    /**
     * removes empty lines from the given string
     * @param str the string
     */
    protected removeEmptyLines(str: string): string {

        return str.split("\n").filter(line => !!(line.trim())).join("\n");
    }
}
