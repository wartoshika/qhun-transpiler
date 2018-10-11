import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { TranspilerFunctions } from "../../../transpiler/TranspilerFunctions";

export interface LuaStringLiteral extends BaseTarget, Target { }
export class LuaStringLiteral implements Partial<Target> {

    public transpileStringLiteral(node: ts.StringLiteral): string {

        // get the raw content
        let literalContent = TranspilerFunctions.replaceReservedChars(node.text);
        literalContent = literalContent.split("").map(char => {

            const charCode = char.charCodeAt(0);
            if (charCode <= 31) {
                switch (charCode) {
                    case 0x07: return "\\\\a";
                    case 0x08: return "\\\\b";
                    case 0x0c: return "\\\\f";
                    case 0x0a: return "\\\\n";
                    case 0x0d: return "\\\\a";
                    case 0x09: return "\\\\t";
                    case 0x0b: return "\\\\v";
                    case 0x5c: return "\\\\\\";
                }
            }
            return char;

        }).join("");

        // get the token text with quotes
        return `"${literalContent}"`;
    }
}
