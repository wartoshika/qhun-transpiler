import { Expression, Node } from "typescript";
import { createTranspiledIdentifier, isTranspiledIdentifier } from "./TranspiledIdentifier";

export interface TranspiledExpression extends Expression {

    _isTranspiled: boolean;
}

export function createTranspiledExpression(code: string): TranspiledExpression {
    return createTranspiledIdentifier(code);
};

export function isTranspiledExpression(node: Node): node is TranspiledExpression {
    return isTranspiledIdentifier(node);
}