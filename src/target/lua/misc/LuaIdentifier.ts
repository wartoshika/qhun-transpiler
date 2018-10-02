import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { LuaReservedKeywordError } from "../../../error/lua/LuaReservedKeywordError";

export interface LuaIdentifier extends BaseTarget, Target { }
export class LuaIdentifier implements Partial<Target> {

    public transpileIdentifier(node: ts.Identifier): string {

        // check if the identifier is undefined
        if (node.originalKeywordKind === ts.SyntaxKind.UndefinedKeyword) {
            return this.transpileNode(ts.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword));
        }

        // get the identifier content
        let identifier = node.escapedText.toString();

        // workarround for a typescript bug that translates an __identifier to a ___identifier
        if (identifier.indexOf("___") === 0) {
            identifier = identifier.substring(1);
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
    private checkForReservedIdentifierToken(nodeContent: string, node: ts.Node): void {

        // build a reserved keyword stack
        // lua is case sensitive, so dont use a lower or upper case version
        // of the identifier to compare
        // @see http://www.lua.org/manual/5.1/manual.html#2.1
        const reservedStack = [
            "and", "break", "do", "else", "elseif",
            "end", "false", "for", "function", "if",
            "in", "local", "nil", "not", "or",
            "repeat", "return", "then", "true", "until", "while"
        ];

        // make the test
        if (reservedStack.indexOf(nodeContent) !== -1) {
            throw new LuaReservedKeywordError(nodeContent, node);
        }
    }
}
