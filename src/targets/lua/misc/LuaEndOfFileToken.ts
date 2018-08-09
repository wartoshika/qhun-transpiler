import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaEndOfFileToken extends BaseTarget, Target { }
export class LuaEndOfFileToken implements Partial<Target> {

    public transpileEndOfFileToken(node: ts.EndOfFileToken): string {

        return "EOF_TOKEN";
    }
}
