import * as ts from "typescript";

export class Types {

    /**
     * check if the given node is a string literal
     * @param type the type to check
     * @param typeChecker the type checker instance
     */
    public static isString(node: ts.Node, typeChecker: ts.TypeChecker): boolean {

        // get the node type
        const nodeType = typeChecker.getTypeAtLocation(node);

        // make the test
        return node && !!(nodeType.flags & ts.TypeFlags.String) || ts.isStringLiteral(node);
    }

    /**
     * check if the given node is an array
     * @param node the node to check
     * @param typeChecker the type checker instance
     */
    public static isArray(node: ts.Node, typeChecker: ts.TypeChecker): boolean {

        // get the node type
        const type = typeChecker.getTypeAtLocation(node);
        const nodeType = typeChecker.typeToTypeNode(type);

        // make the test
        return nodeType && (nodeType.kind === ts.SyntaxKind.ArrayType || nodeType.kind === ts.SyntaxKind.TupleType);
    }
}
