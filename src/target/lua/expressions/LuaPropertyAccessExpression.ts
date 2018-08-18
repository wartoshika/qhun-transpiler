import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { LuaStringSpecial, LuaObjectSpecial, LuaArraySpecial } from "../special";
import { Types } from "../../../transpiler/Types";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaPropertyAccessExpression extends BaseTarget, Target, LuaStringSpecial, LuaObjectSpecial, LuaArraySpecial { }
export class LuaPropertyAccessExpression implements Partial<Target> {

    public transpilePropertyAccessExpression(node: ts.PropertyAccessExpression): string {

        // get the base property name
        const name = this.transpileNode(node.name);

        // get the expression by checking its type
        try {
            const expressionType = this.typeChecker.getTypeAtLocation(node.expression);
            switch (expressionType.flags) {
                case ts.TypeFlags.String:
                case ts.TypeFlags.StringLiteral:
                    return this.transpileSpecialStringProperty(node);
                case ts.TypeFlags.Object:

                    // check if this is an array
                    if (Types.isArray(node.expression, this.typeChecker)) {
                        return this.transpileSpecialArrayProperty(node);
                    }
            }

        } catch (e) {

            // type chould not be evaluated, use the default access pattern
            if (e instanceof UnsupportedError) {
                throw e;
            }
        }

        // use normal lua property access
        const expression = this.transpileNode(node.expression);
        return `${expression}.${name}`;
    }
}
