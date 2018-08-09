import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaSwitchStatement extends BaseTarget, Target { }
export class LuaSwitchStatement implements Partial<Target> {

    public transpileSwitchStatement(node: ts.SwitchStatement): string {

        return "SWITCH";
    }
}
