import * as ts from "typescript";

export class Types {

    /**
     * check if the given type is a string literal
     * @param type the type to check
     */
    public static isString(node: ts.Node, typeChecker: ts.TypeChecker): boolean {

        // if there is no parent available add a parent to avoid a typescript bug
        if (node.parent === undefined) {
            node.parent = ts.createNode(ts.SyntaxKind.EmptyStatement);
        }

        // get the node type
        const nodeType = typeChecker.getTypeAtLocation(node);

        // make the test
        return !!(nodeType.flags & ts.TypeFlags.String) || ts.isStringLiteral(node);
    }
}
