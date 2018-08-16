import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaExportDeclaration extends BaseTarget, Target { }
export class LuaExportDeclaration implements Partial<Target> {

    public transpileExportDeclaration(node: ts.ExportDeclaration): string {

        throw new UnsupportedError(`Export declarations are unsupported!`, node);
    }
}
