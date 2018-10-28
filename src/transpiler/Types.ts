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
     * @param isCallExpression flag if the node origins at a call expression
     */
    public static isArray(node: ts.Node, typeChecker: ts.TypeChecker, isCallExpression: boolean = false): boolean {

        // get the node type
        const type = typeChecker.getTypeAtLocation(node);
        const nodeType = typeChecker.typeToTypeNode(type);
        const symbol = typeChecker.getSymbolAtLocation(node);

        let typeLiteralArrayTypes: ts.SyntaxKind[];

        // try to identify mapped types with string or number index signature and array type values
        try {

            // check if the given node is a mapped type node
            const mappedTypeKind: ts.SyntaxKind = (node as any).expression.flowNode.node.symbol.valueDeclaration.type.kind;
            if (mappedTypeKind === ts.SyntaxKind.MappedType) {

                // get the type of the value
                const targetType: ts.SyntaxKind = (node as any).expression.flowNode.node.symbol.valueDeclaration.type.type.kind;

                // check for types like: { test: any[] }
                if (targetType === ts.SyntaxKind.ArrayType) {
                    return true;
                } else if (
                    // check for types like: { test: Array<any> }
                    // array is a type reference, use the reference text to check if this is an array
                    targetType === ts.SyntaxKind.TypeReference &&
                    (node as any).expression.flowNode.node.symbol.valueDeclaration.type.type.typeName.escapedText === "Array"
                ) {
                    return true;
                }
            }
        } catch (e) {

            // ignore catch and proceed
        }

        // at typescript >= 3 array types can be type literals
        if (symbol && symbol.declarations && nodeType && (nodeType.kind === ts.SyntaxKind.TypeLiteral || nodeType.kind === ts.SyntaxKind.MappedType)) {

            typeLiteralArrayTypes = symbol.declarations.map(dec => {

                const decType = (dec as any).type;
                if (isCallExpression && decType && decType.type && decType.type.kind) {
                    return decType.type.kind;
                } else if (!decType) {
                    return ts.SyntaxKind.Unknown;
                }
                return decType.kind;
            });
        }

        // make the test
        return nodeType
            // is an array literal
            && (
                ts.isArrayLiteralExpression(node)
                // is a typescript 3 type literal
                || (typeLiteralArrayTypes
                    && typeLiteralArrayTypes.every(typeLiteral => typeLiteral === ts.SyntaxKind.ArrayType || typeLiteral === ts.SyntaxKind.TupleType)
                )
                // normal types (typescript < 3)
                || (nodeType.kind === ts.SyntaxKind.ArrayType || nodeType.kind === ts.SyntaxKind.TupleType)
            ) || (
                // search for deeper existing types in a call expression
                isCallExpression && (node as any).expression && Types.isArray((node as any).expression, typeChecker, isCallExpression)
            );
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

        return node && !!(type.flags & ts.TypeFlags.Object) || ts.isObjectLiteralElement(node);

        // make the test
        // return nodeType && (nodeType.kind === ts.SyntaxKind.ObjectLiteralExpression);
    }

    /**
     * check if the given node is a function
     * @param node the node to check
     * @param typeChecker the type checker instance
     */
    public static isFunction(node: ts.Node, typeChecker: ts.TypeChecker): boolean {

        // get the node type
        const type = typeChecker.getTypeAtLocation(node);
        const nodeType = typeChecker.typeToTypeNode(type);

        // single function type kind check
        return nodeType.kind === ts.SyntaxKind.FunctionType;
    }
}
