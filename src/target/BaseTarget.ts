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
}
