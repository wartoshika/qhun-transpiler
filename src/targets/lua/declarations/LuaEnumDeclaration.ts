import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaEnumDeclaration extends BaseTarget, Target { }
export class LuaEnumDeclaration implements Partial<Target> {

    public transpileEnumDeclaration(node: ts.EnumDeclaration): string {

        return "ENUM";
    }
}
