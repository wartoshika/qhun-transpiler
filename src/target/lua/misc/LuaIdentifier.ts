import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaIdentifier extends BaseTarget, Target { }
export class LuaIdentifier implements Partial<Target> {

    public transpileIdentifier(node: ts.Identifier): string {

        // check if the identifier is undefined
        if (node.originalKeywordKind === ts.SyntaxKind.UndefinedKeyword) {
            return this.transpileNode(ts.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword));
        }

        // get the identifier name
        return node.escapedText.toString();
    }
}
