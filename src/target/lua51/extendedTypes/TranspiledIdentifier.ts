import { createIdentifier, Node, Identifier } from "typescript";

export interface TranspiledIdentifier extends Identifier {

    _isTranspiled: boolean;
}

export function createTranspiledIdentifier(name: string): TranspiledIdentifier {
    const expr = createIdentifier(name) as TranspiledIdentifier;
    expr._isTranspiled = true;
    return expr as TranspiledIdentifier;
};

export function isTranspiledIdentifier(node: Node): node is TranspiledIdentifier {
    return node && (node as TranspiledIdentifier)._isTranspiled;
}