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
     * test if the given node has an export modifier
     * @param node the node to check
     * @param typeChecker the type checker
     */
    public static hasExportModifier(node: ts.Node, typeChecker: ts.TypeChecker): boolean {

        // special test case for variable declarations because they do not have the export modifier
        // set to its local modifier property. use the source file symbol to check exports
        if (ts.isVariableDeclaration(node)) {
            const sf = node.getSourceFile();
            const symbol = typeChecker.getSymbolAtLocation(sf);

            // check if the symbol is available
            if (symbol) {
                let found = false;
                if (symbol.exports.size > 0) {
                    symbol.exports.forEach((_, key) => {
                        if (node.name.getText() === key) {
                            found = true;
                        }
                    });

                    if (found) {
                        return true;
                    }
                }
            }
        }

        return node.modifiers && node.modifiers.some((x) => x.kind === ts.SyntaxKind.ExportKeyword);
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
