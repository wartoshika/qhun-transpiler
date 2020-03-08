import { NodeContainingException } from "./NodeContainingException";
import { Node } from "typescript";

export class UnsupportedNodeException extends NodeContainingException {

    constructor(message: string, node: Node, alternativeNode?: Node) {
        super(message, node, alternativeNode);

        (this as any).__proto__ = UnsupportedNodeException.prototype;
    }
}