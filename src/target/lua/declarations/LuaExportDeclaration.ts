import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaExportDeclaration extends BaseTarget, Target { }
export class LuaExportDeclaration implements Partial<Target> {

    public transpileExportDeclaration(node: ts.ExportDeclaration): string {

        return "EXPORT";
    }
}
