import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { LuaKeywords } from "../LuaKeywords";

export interface LuaKeyword extends BaseTarget, Target { }
export class LuaKeyword implements Partial<Target> {

    public transpileKeyword(node: ts.Node): string {

        switch (node.kind) {
            case ts.SyntaxKind.TrueKeyword:
                return "true";
            case ts.SyntaxKind.FalseKeyword:
                return "false";
            case ts.SyntaxKind.UndefinedKeyword:
            case ts.SyntaxKind.NullKeyword:
                return "nil";
            case ts.SyntaxKind.ThisKeyword:
                return "self";
            case ts.SyntaxKind.SuperKeyword:
                return `self.${LuaKeywords.CLASS_SUPER_REFERENCE_NAME}`;
        }
    }
}
