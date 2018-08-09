import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaNumericLiteral extends BaseTarget, Target { }
export class LuaNumericLiteral implements Partial<Target> {

    public transpileNumericLiteral(node: ts.NumericLiteral): string {

        return "NUMERIC_LITERAL";
    }
}
