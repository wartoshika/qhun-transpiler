import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaKeyword extends BaseTarget, Target { }
export class LuaKeyword implements Partial<Target> {

    public transpileKeyword(node: ts.Node): string {

        switch(node.kind) {
            case ts.SyntaxKind.TrueKeyword:
                return "true";
            case ts.SyntaxKind.FalseKeyword:
                return "false";
            case ts.SyntaxKind.NullKeyword:
                return "nil";
            case ts.SyntaxKind.UndefinedKeyword:
                return "nil";
            case ts.SyntaxKind.ThisKeyword:
                return "self";
            case ts.SyntaxKind.SuperKeyword:
                return "__super";
        }
    }
}
