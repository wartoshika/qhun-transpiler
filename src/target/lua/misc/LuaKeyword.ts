import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { LuaKeywords } from "../LuaKeywords";
import { LuaClassDeclaration } from "../declarations";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaKeyword extends BaseTarget, Target, LuaClassDeclaration { }
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

                const className = this.lastParsedClassName;
                if (!className) {
                    throw new UnsupportedError(`Trying to access a super object while not beeing in a class context is unsupported!`, node);
                }

                return `${className}.${LuaKeywords.CLASS_SUPER_REFERENCE_NAME}`;
        }
    }
}
