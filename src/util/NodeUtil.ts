import { Node, getLineAndCharacterOfPosition } from "typescript";

export class NodeUtil {

    public static getNodeFileAndPosition(node: Node): string {

        const sf = node.getSourceFile();
        return `(${sf.fileName}:${getLineAndCharacterOfPosition(sf, node.pos).line + 1}:${getLineAndCharacterOfPosition(sf, node.pos).character})`;
    }

    public static getNodeWithConcretePosition(first: Node, second?: Node): Node | null {

        try {
            const sf = first.getSourceFile();
            getLineAndCharacterOfPosition(sf, first.pos);
            return first;
        } catch (e) {
            if (second) {
                try {

                    const sf = second.getSourceFile();
                    getLineAndCharacterOfPosition(sf, second.pos);
                    return second;
                } catch (e) {
                    return null;
                }
            }
        }
        return null;
    }
}