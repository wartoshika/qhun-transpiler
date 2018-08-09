import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaExportAssignment extends BaseTarget, Target { }
export class LuaExportAssignment implements Partial<Target> {

    public transpileExportAssignment(node: ts.ExportAssignment): string {

        return "EXPORT_ASSIGNMENT";
    }
}
