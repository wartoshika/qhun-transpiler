import { Node, CallExpression, PropertyAccessExpression } from "typescript";
import { PartialTranspiler } from "./PartialTranspiler";
import { UnsupportedNodeException } from "../../exception/UnsupportedNodeException";

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

        throw new UnsupportedNodeException(`Property/Method ${name} is not supported on the current object type!`, node);
    }

    protected getTranspiledArguments(node: CallExpression): string {

        return node.arguments
            .map(arg => this.transpiler.transpileNode(arg))
            .join("," + this.transpiler.space());
    }

    protected getOwnerName(node: CallExpression): string {

        const owner = (node.expression as PropertyAccessExpression).expression;
        return this.transpiler.transpileNode(owner);
    }

    protected generateCallable(node: CallExpression, args: string[], body: string[]): string {

        return [
            `(»function»(»${args.join(",»")}${args.length > 0 ? "»" : ""})`,
            this.transpiler.addIntend(
                body.join(this.transpiler.break())
            ),
            `end»)»(»${this.getOwnerName(node)},»${this.getTranspiledArguments(node)}»)`
        ].join(this.transpiler.break())
    }
}