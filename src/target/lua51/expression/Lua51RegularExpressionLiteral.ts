import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { RegularExpressionLiteral, createStringLiteral } from "typescript";
import { UnsupportedNodeException } from "../../../exception/UnsupportedNodeException";

export class Lua51RegularExpressionLiteral extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    /**
     * @inheritdoc
     */
    public regularExpressionLiteral(node: RegularExpressionLiteral): string {

        // all supported lua regexp modifier
        const supportedLuaRegexpModifier: string[] = [
            "a", "c", "d", "l", "p", "s", "u", "w", "x", "z"
        ];

        const regexp: string = node.getText()
            .replace(/\\([a-z]?)/, (_, regexpChar) => {

                if (supportedLuaRegexpModifier.indexOf(regexpChar) === -1) {

                    this.transpiler.registerError({
                        node: node,
                        message: `Using a RegExp expression with a \\${regexpChar} modifier is unsupported in LUA. Lua supports the following modifier: ${supportedLuaRegexpModifier.join("\n")}`
                    });
                    return "[ERROR]";
                }

                return `%${regexpChar}`;
            })
            // remove leading and trailing / chars
            .slice(1, -1);

        // use table unpack to spread
        return this.transpiler.transpileNode(createStringLiteral(regexp));
    }
}