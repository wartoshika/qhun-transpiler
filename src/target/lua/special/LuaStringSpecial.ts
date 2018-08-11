import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaStringSpecial extends BaseTarget, Target { }
export class LuaStringSpecial {

    /**
     * transpiles a special string property access
     * @param node the node to transpile
     */
    public transpileSpecialStringProperty(node: ts.PropertyAccessExpression): string {

        // get the accessor name
        const name = this.transpileNode(node.name);

        // look for special names
        switch (name) {
            case "length":
                return this.transpileSpecialStringPropertyLength(node);
            default:
                throw new UnsupportedError(`The given string property ${name} is unsupported!`, node);
        }
    }

    /**
     * transpiles a string.length into lua
     * @param node the node to transpile
     */
    private transpileSpecialStringPropertyLength(node: ts.PropertyAccessExpression): string {

        return `string.len(${this.transpileNode(node.expression)})`;
    }
}
