import { Node, getLineAndCharacterOfPosition, SourceFile } from "typescript";

const getNode = (a: Node, b?: Node) => {
    try {
        const sf = a.getSourceFile();
        getLineAndCharacterOfPosition(sf, a.pos);
        return a;
    } catch (e) {
        if (b) {
            try {

                const sf = b.getSourceFile();
                getLineAndCharacterOfPosition(sf, b.pos);
                return b;
            } catch (e) {
                return null;
            }
        }
    }
    return null;
};

const getPosition = (a: Node, b?: Node) => {

    const node = getNode(a, b);
    if (!node) {
        return "";
    }

    const sf = node.getSourceFile();

    return `(${sf.fileName}:${getLineAndCharacterOfPosition(sf, node.pos).line + 1}:${getLineAndCharacterOfPosition(sf, node.pos).character})`;
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