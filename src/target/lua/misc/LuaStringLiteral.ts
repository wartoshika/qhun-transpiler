import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaStringLiteral extends BaseTarget, Target { }
export class LuaStringLiteral implements Partial<Target> {

    public transpileStringLiteral(node: ts.StringLiteral): string {

        // get the token text with quotes
        return `"${node.text}"`;
    }
}
