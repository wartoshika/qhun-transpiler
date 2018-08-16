import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaModuleDeclaration extends BaseTarget, Target { }
export class LuaModuleDeclaration implements Partial<Target> {

    public transpileModuleDeclaration(node: ts.ModuleDeclaration): string {

        throw new UnsupportedError(`Module declarations are unsupported!`, node);
    }
}
