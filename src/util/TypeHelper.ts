import { TypeChecker, Node, isVariableDeclaration, SyntaxKind, TypeNode, isParameter, isTypeReferenceNode, isTypeNode, ArrayTypeNode, isTypeQueryNode, TypeFlags, isStringLiteral, isArrayLiteralExpression } from "typescript";
import { Transpiler } from "../transpiler";

export class TypeHelper {

    constructor(
        private typeChecker: TypeChecker,
        private transpiler: Transpiler
    ) { }

    public hasExportModifier(node: Node): boolean {

        // special test case for variable declarations because they do not have the export modifier
        // set to its local modifier property. use the source file symbol to check exports
        if (isVariableDeclaration(node)) {
            const sf = node.getSourceFile();
            const symbol = this.typeChecker.getSymbolAtLocation(sf);

            // check if the symbol is available
            if (symbol && symbol.exports) {
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

        if (node.modifiers) {
            return node.modifiers.some((x) => x.kind === SyntaxKind.ExportKeyword);
        }
        return false;
    }

    /**
     * test if the given node has an explicit visibility modifier
     * @param node the node to test
     */
    public hasExplicitVisibility(node: Node): boolean {

        const visibilityStack: SyntaxKind[] = [
            SyntaxKind.PrivateKeyword,
            SyntaxKind.ProtectedKeyword,
            SyntaxKind.PublicKeyword
        ];

        if (node.modifiers) {
            return node.modifiers.some(mod => visibilityStack.indexOf(mod.kind) !== -1);
        }
        return false;
    }

    public typeOfNode(node: Node): string {
        let type: TypeNode | undefined = undefined;
        if (isParameter(node)) {
            type = node.type
        } else if (isTypeNode(node)) {
            type = node;
        }

        if (!type) {
            return SyntaxKind[node.kind] || "Unknown";
        }

        let name = SyntaxKind[type.kind];
        if (isTypeReferenceNode(type)) {
            name = this.transpiler.transpileNode(type.typeName);
        } else if (isTypeQueryNode(type)) {
            name = [
                SyntaxKind[type.kind],
                "(",
                this.transpiler.transpileNode(type.exprName),
                ")"
            ].join("");
        }

        // generic type?
        let generic: string = "";
        if ((type as ArrayTypeNode).elementType) {
            generic = "<" + this.typeOfNode((type as ArrayTypeNode).elementType) + ">";
        }

        return name + generic;
    }

    /**
     * check if the given node is a string literal
     * @param type the type to check
     * @param typeChecker the type checker instance
     */
    public isString(node: Node): boolean {

        // get the node type
        const nodeType = this.typeChecker.getTypeAtLocation(node);

        // make the test
        return node && !!(nodeType.flags & TypeFlags.String) || isStringLiteral(node);
    }

    /**
     * check if the given node has a static modifier
     * @param node the node to check
     */
    public isStatic(node: Node): boolean {

        if (node.modifiers) {
            return node.modifiers.some(mod => mod.kind === SyntaxKind.StaticKeyword);
        }
        return false;
    }

    /**
     * check if the given node is an array
     * @param node the node to check
     * @param isCallExpression flag if the node origins at a call expression
     */
    public isArray(node: Node, isCallExpression: boolean = false): boolean {

        // get the node type
        const type = this.typeChecker.getTypeAtLocation(node);
        const nodeType = this.typeChecker.typeToTypeNode(type);
        const symbol = this.typeChecker.getSymbolAtLocation(node);

        let typeLiteralArrayTypes: SyntaxKind[] = [];

        // try to identify mapped types with string or number index signature and array type values
        try {

            // check if the given node is a mapped type node
            const mappedTypeKind: SyntaxKind = (node as any).expression.flowNode.node.symbol.valueDeclaration.type.kind;
            if (mappedTypeKind === SyntaxKind.MappedType) {

                // get the type of the value
                const targetType: SyntaxKind = (node as any).expression.flowNode.node.symbol.valueDeclaration.type.type.kind;

                // check for types like: { test: any[] }
                if (targetType === SyntaxKind.ArrayType) {
                    return true;
                } else if (
                    // check for types like: { test: Array<any> }
                    // array is a type reference, use the reference text to check if this is an array
                    targetType === SyntaxKind.TypeReference &&
                    (node as any).expression.flowNode.node.symbol.valueDeclaration.type.type.typeName.escapedText === "Array"
                ) {
                    return true;
                }
            }
        } catch (e) {

            // ignore catch and proceed
        }

        // at typescript >= 3 array types can be type literals
        if (symbol && symbol.declarations && nodeType && (nodeType.kind === SyntaxKind.TypeLiteral || nodeType.kind === SyntaxKind.MappedType)) {

            typeLiteralArrayTypes = symbol.declarations.map(dec => {

                const decType = (dec as any).type;
                if (isCallExpression && decType && decType.type && decType.type.kind) {
                    return decType.type.kind;
                } else if (!decType) {
                    return SyntaxKind.Unknown;
                }
                return decType.kind;
            });
        }

        // make the test
        return nodeType
            // is an array literal
            && (
                isArrayLiteralExpression(node)
                // is a typescript 3 type literal
                || (typeLiteralArrayTypes
                    && typeLiteralArrayTypes.every(typeLiteral => typeLiteral === SyntaxKind.ArrayType || typeLiteral === SyntaxKind.TupleType)
                )
                // normal types (typescript < 3)
                || (nodeType.kind === SyntaxKind.ArrayType || nodeType.kind === SyntaxKind.TupleType)
            ) || (
                // search for deeper existing types in a call expression
                isCallExpression && (node as any).expression && this.isArray((node as any).expression, isCallExpression)
            );
    }

    /**
     * gets the raw type checker instance from typescript
     */
    public getTypeChecker(): TypeChecker {
        return this.typeChecker;
    }
}