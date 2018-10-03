import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaRegularExpressionLiteral extends BaseTarget, Target { }
export class LuaRegularExpressionLiteral implements Partial<Target> {

    public transpileRegularExpressionLiteral(node: ts.RegularExpressionLiteral): string {

        // all supported lua regexp modifier
        const supportedLuaRegexpModifier: string[] = [
            "a", "c", "d", "l", "p", "s", "u", "w", "x", "z"
        ];

        const regexp: string = node.getText()
            .replace(/\\([a-z]?)/, (_, regexpChar) => {

                if (supportedLuaRegexpModifier.indexOf(regexpChar) === -1) {
                    // tslint:disable-next-line max-line-length
                    throw new UnsupportedError(`Using a RegExp expression with a \\${regexpChar} modifier is unsupported in LUA. Lua supports the following modifier: ${supportedLuaRegexpModifier.join("\n")}`, node);
                }

                return `%${regexpChar}`;
            })
            // remove leading and trailing / chars
            .slice(1, -1);

        // use table unpack to spread
        return this.transpileNode(ts.createStringLiteral(regexp));
    }
}
