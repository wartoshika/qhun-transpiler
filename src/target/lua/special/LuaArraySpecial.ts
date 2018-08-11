import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaArraySpecial extends BaseTarget, Target { }
export class LuaArraySpecial {

    /**
     * transpiles a special array property access
     * @param node the node to transpile
     */
    public transpileSpecialArrayProperty(node: ts.PropertyAccessExpression): string {

        // get the name
        const name = this.transpileNode(node.name);

        // look for special names
        switch (name) {
            case "length":
                return this.transpileSpecialArrayPropertyLength(node);
            default:
                throw new UnsupportedError(`The given array property ${name} is unsupported!`, node);
        }
    }

    /**
     * transpiles an array.length into lua
     * @param node the node to transpile
     */
    private transpileSpecialArrayPropertyLength(node: ts.PropertyAccessExpression): string {

        return `#${this.transpileNode(node.expression)}`;
    }
}
