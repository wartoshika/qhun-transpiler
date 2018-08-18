import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { TranspilerFunctions } from "../../../transpiler/TranspilerFunctions";

export interface LuaStringLiteral extends BaseTarget, Target { }
export class LuaStringLiteral implements Partial<Target> {

    public transpileStringLiteral(node: ts.StringLiteral): string {

        // get the raw content
        const literalContent = TranspilerFunctions.replaceReservedChars(node.text);

        // get the token text with quotes
        return `"${literalContent}"`;
    }
}
