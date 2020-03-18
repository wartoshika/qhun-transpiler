import { Node, CallExpression, PropertyAccessExpression, Expression } from "typescript";
import { PartialTranspiler } from "./PartialTranspiler";

export abstract class AbstractSpecialHandler<T extends Node> extends PartialTranspiler {

    public isSupported(name: string): boolean {

        return Object.keys(this)
            .map(prop => prop.replace("handle", ""))
            .some(prop => prop.toUpperCase() === name.toUpperCase());
    }

    public handle(name: string, node: T): string {

        const handlerName = `handle${name[0].toUpperCase()}${name.substring(1)}`;
        if (typeof (this as any)[handlerName] === "function") {
            return (this as any)[handlerName](node);
        }

        this.transpiler.registerError({
            node: node,
            message: `Property/Method ${name} is not supported on this type!`
        });
        return "[ERROR]";
    }

    protected getTranspiledArguments(args: Expression[]): string {

        return args
            .map(arg => this.transpiler.transpileNode(arg))
            .join("," + this.transpiler.space());
    }

    protected getOwnerName(node: CallExpression): string {

        const owner = (node.expression as PropertyAccessExpression).expression;
        return this.transpiler.transpileNode(owner);
    }

    protected generateCallable(node: CallExpression, args: string[], body: string[], options: {
        defaultArgumentsWhenEmpty?: string,
        ignoreOwner?: boolean,
        argsAsObject?: boolean,
        skipArgs?: number
    } = {}): string {

        options.defaultArgumentsWhenEmpty = options.defaultArgumentsWhenEmpty || "";
        options.ignoreOwner = typeof options.ignoreOwner === "boolean" ? options.ignoreOwner : false;
        options.argsAsObject = typeof options.argsAsObject === "boolean" ? options.argsAsObject : false;
        options.skipArgs = typeof options.skipArgs === "number" ? options.skipArgs : 0;

        let nodeArgs = this.getTranspiledArguments(node.arguments.filter(
            (node, index) => {
                if (index < options.skipArgs!) {
                    return false
                }
                return true;
            }
        ));
        if (nodeArgs.length === 0) {
            nodeArgs = options.defaultArgumentsWhenEmpty;
        }

        if (options.argsAsObject) {
            nodeArgs = `{»${nodeArgs}»}`;
        }

        const callParams: string[] = [nodeArgs];
        if (!options.ignoreOwner) {
            callParams.unshift(this.getOwnerName(node));
        }

        return [
            `(»function»(»${args.join(",»")}${args.length > 0 ? "»" : ""})`,
            this.transpiler.addIntend(
                body.join(this.transpiler.break())
            ),
            `end»)»(»${callParams.join(",»")}»)`
        ].join(this.transpiler.break())
    }
}