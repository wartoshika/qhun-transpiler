import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaExportAssignment extends BaseTarget, Target { }
export class LuaExportAssignment implements Partial<Target> {

    public transpileExportAssignment(node: ts.ExportAssignment): string {

        throw new UnsupportedError(`Export assignments are unsupported!`, node);
    }
}
