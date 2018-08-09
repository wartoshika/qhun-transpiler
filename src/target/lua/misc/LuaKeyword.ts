import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaKeyword extends BaseTarget, Target { }
export class LuaKeyword implements Partial<Target> {

    public transpileKeyword(node: ts.KeywordTypeNode): string {

        return "KEYWORD";
    }
}
