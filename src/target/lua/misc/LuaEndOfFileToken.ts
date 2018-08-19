import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaEndOfFileToken extends BaseTarget, Target { }
export class LuaEndOfFileToken implements Partial<Target> {

    public transpileEndOfFileToken(node: ts.EndOfFileToken): string {

        // when transpiling an EOF token, new a new line character
        return "\n";
    }
}
