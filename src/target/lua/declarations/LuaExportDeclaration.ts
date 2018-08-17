import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaExportDeclaration extends BaseTarget, Target { }
export class LuaExportDeclaration implements Partial<Target> {

    public transpileExportDeclaration(node: ts.ExportDeclaration): string {

        // get export * from
        if (node.moduleSpecifier && !node.exportClause) {

            // get the module specifier and add the export
            const moduleSpecifier = this.transpileNode(node.moduleSpecifier);
            this.addExport(moduleSpecifier, node, true);

            // empty string because the post transpiling will add the final export
            return "";
        } else {
            throw new UnsupportedError(`An export declaration must have a module specifier!`, node);
        }
    }
}
