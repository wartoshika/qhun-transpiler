import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaObjectSpecial extends BaseTarget, Target { }
export class LuaObjectSpecial {

    /**
     * transpiles a special object property access
     * @param node the node to transpile
     */
    public transpileSpecialObjectProperty(node: ts.PropertyAccessExpression): string {

        // get the name
        const name = this.transpileNode(node.name);

        // all object properties are currently unsupported!
        throw new UnsupportedError(`The given object property ${name} is unsupported!`, node);
    }
}
