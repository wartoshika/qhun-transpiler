import { Node, SourceFile } from "typescript";
import { NodeUtil } from "../util/NodeUtil";

const getPosition = (a: Node, b?: Node) => {

    const node = NodeUtil.getNodeWithConcretePosition(a, b);
    if (!node) {
        return "";
    }

    return NodeUtil.getNodeFileAndPosition(node);
}

export class NodeContainingException extends Error {

    public static currentSourceFile: SourceFile | undefined;

    constructor(
        message: string,
        public node: Node,
        public alternativeNode?: Node
    ) {
        super(`${message} ${getPosition(node, alternativeNode)}`);

        this.node = node;

        (this as any).__proto__ = NodeContainingException.prototype;
    }
}