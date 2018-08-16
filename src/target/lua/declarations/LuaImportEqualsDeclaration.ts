import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaImportEqualsDeclaration extends BaseTarget, Target { }
export class LuaImportEqualsDeclaration implements Partial<Target> {

    public transpileImportEqualsDeclaration(node: ts.ImportEqualsDeclaration): string {

        throw new UnsupportedError(`import = require(...) declarations are unsupported!`, node);
    }
}
