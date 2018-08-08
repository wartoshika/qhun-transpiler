import { Target } from "../Target";
import * as ts from "typescript";
import { BaseTarget } from "../BaseTarget";

export interface LuaBlock extends BaseTarget, Target { }
export class LuaBlock implements Partial<Target> {

    public transpileBlock(node: ts.Block): string {

        return "BLOCK";
    }
}
