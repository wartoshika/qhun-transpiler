import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaImportEqualsDeclaration extends BaseTarget, Target { }
export class LuaImportEqualsDeclaration implements Partial<Target> {

    public transpileImportEqualsDeclaration(node: ts.ImportEqualsDeclaration): string {

        return "IMPORT_EQUALS";
    }
}
