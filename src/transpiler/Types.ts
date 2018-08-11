import * as ts from "typescript";

export class Types {

    /**
     * check if the given node has a static modifier
     * @param node the node to check
     */
    public static isStatic(node: ts.Node): boolean {

        return node.modifiers && node.modifiers.some(mod => mod.kind === ts.SyntaxKind.StaticKeyword);
    }

    /**
     * test if the given node has an explicit visibility modifier
     * @param node the node to test
     */
    public static hasExplicitVisibility(node: ts.Node): boolean {

        const visibilityStack: ts.SyntaxKind[] = [
            ts.SyntaxKind.PrivateKeyword,
            ts.SyntaxKind.ProtectedKeyword,
            ts.SyntaxKind.PublicKeyword
        ];

        return node.modifiers && node.modifiers.some(mod => visibilityStack.indexOf(mod.kind) !== -1);
    }

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

    /**
     * check if the given node is an object
     * @param node the node to check
     * @param typeChecker the type checker instance
     */
    public static isObject(node: ts.Node, typeChecker: ts.TypeChecker): boolean {

        // get the node type
        const type = typeChecker.getTypeAtLocation(node);
        const nodeType = typeChecker.typeToTypeNode(type);

        // make the test
        return nodeType && (nodeType.kind === ts.SyntaxKind.ObjectLiteralExpression);
    }
}
