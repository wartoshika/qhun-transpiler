import { Identifier, Block, StringLiteral, Node, ArrayBindingPattern } from "typescript";
import { PartialTranspiler } from "./impl/PartialTranspiler";

export interface MiscTranspiler extends PartialTranspiler {

    /**
     * transpiles an identifer
     * @param node the node to transpile
     */
    identifier(node: Identifier): string;

    /**
     * transpiles a block
     * @param node the node to transpile
     */
    block(node: Block): string;

    /**
     * transpiles a string literal
     * @param node the node to transpile
     */
    stringLiteral(node: StringLiteral): string;

    /**
     * transpiles a first literal token
     * @param node the node to transpile
     */
    firstLiteralToken(node: Node): string;

    /**
     * transpiles a keyword
     * @param node the keyword node to transpile
     */
    keyword(node: Node): string;

    /**
     * transpiles aan array binding pattern
     * @param node the keyword node to transpile
     */
    arrayBindingPattern(node: ArrayBindingPattern): string;
}