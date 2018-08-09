import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaIdentifier extends BaseTarget, Target { }
export class LuaIdentifier implements Partial<Target> {

    public transpileIdentifier(node: ts.Identifier): string {

        // get the identifier name
        return node.escapedText.toString();
    }
}
