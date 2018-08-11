import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaInterfaceDeclaration extends BaseTarget, Target { }
export class LuaInterfaceDeclaration implements Partial<Target> {

    public transpileInterfaceDeclaration(node: ts.InterfaceDeclaration): string {

        // interfaces are skipped!
        return "";
    }
}
