import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { MiscTranspiler } from "../../../transpiler";
import { Identifier, SyntaxKind, createKeywordTypeNode, Node } from "typescript";
import { isTranspiledExpression } from "../extendedTypes/TranspiledExpression";
import { ReservedKeywordException } from "../../../exception/ReservedKeywordException";
import { isTranspiledIdentifier } from "../extendedTypes/TranspiledIdentifier";

export class Lua51Identifier extends PartialTranspiler implements Partial<MiscTranspiler> {

    // build a reserved keyword stack
    // lua is case sensitive, so dont use a lower or upper case version
    // of the identifier to compare
    // @see http://www.lua.org/manual/5.1/manual.html#2.1
    private reservedStack = [
        "and", "break", "do", "else", "elseif",
        "end", "false", "for", "function", "if",
        "in", "local", "nil", "not", "or",
        "repeat", "return", "then", "true", "until", "while"
    ];

    /**
     * @inheritdoc
     */
    public identifier(node: Identifier): string {

        if (isTranspiledExpression(node) || isTranspiledIdentifier(node)) {
            return node.text;
        }

        // check if the identifier is undefined
        if (node.originalKeywordKind === SyntaxKind.UndefinedKeyword) {
            return this.transpiler.transpileNode(createKeywordTypeNode(SyntaxKind.UndefinedKeyword));
        }

        // get the identifier content
        let identifier = node.escapedText.toString();

        // workarround for a typescript bug that translates an __identifier to a ___identifier
        if (identifier.indexOf("___") === 0) {
            identifier = identifier.substring(1);
        }

        // obscurify identifier if configured
        if (!this.isReservedKeyword(identifier)) {
            identifier = this.transpiler.getIdentifierName(identifier);
        }

        // check for reserved keywords
        this.checkForReservedIdentifierToken(identifier, node);

        // get the identifier name
        return identifier;
    }

    /**
     * check if the identifier is a reserved lua keyword
     * @param nodeContent the transpiled node content
     */
    private checkForReservedIdentifierToken(nodeContent: string, node: Node): void {

        // make the test
        if (this.reservedStack.indexOf(nodeContent) !== -1) {
            throw new ReservedKeywordException(nodeContent, node);
        }
    }

    private isReservedKeyword(text: string): boolean {
        return [...this.reservedStack, "self"].indexOf(text) !== -1;
    }
}