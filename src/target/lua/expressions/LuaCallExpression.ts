import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";
import { LuaArraySpecial, LuaObjectSpecial, LuaStringSpecial } from "../special";
import { Types } from "../../../transpiler/Types";

export interface LuaCallExpression extends BaseTarget, Target, LuaArraySpecial, LuaObjectSpecial, LuaStringSpecial { }
export class LuaCallExpression implements Partial<Target> {

    public transpileCallExpression(node: ts.CallExpression): string {

        // get arguments
        const argumentStack: string[] = node.arguments.map(arg => this.transpileNode(arg));

        // check if the call expression is from an access expression
        if (ts.isPropertyAccessExpression(node.expression)) {
            return this.transpileCallExpressionOnProperty(node, argumentStack);
        }

        // get base expression
        const base = this.transpileNode(node.expression);

        // put everything together
        return `${base}(${argumentStack.join(", ")})`;
    }

    /**
     * transpiles a call expression from a property access expression
     * @param node the node to transpile
     * @param argumentStack the argument stack
     */
    private transpileCallExpressionOnProperty(node: ts.CallExpression, argumentStack: string[]): string {

        // get the called function name
        const functionObj = node.expression as ts.PropertyAccessExpression;
        const functionName = this.removeQuotes(this.transpileNode(functionObj.name));

        // check if the function call comes from an known object that
        // supports special functions
        const owner = (node.expression as ts.PropertyAccessExpression).expression;
        const ownerName = this.transpileNode(owner);
        let ownerNameCheck = this.transpileNode(owner);

        // preperation for calls like "test".replace() or [1,2].map()
        if (Types.isString(owner, this.typeChecker)) {
            ownerNameCheck = "String";
        } else if (Types.isArray(owner, this.typeChecker)) {
            ownerNameCheck = "Array";
        } else if (Types.isObject(owner, this.typeChecker)) {
            ownerNameCheck = "Object";
        }

        // generate a function signature string
        let signature: string;

        // check if there are some special objects
        switch (ownerNameCheck) {
            case "Object":

                break;
            case "String":
                signature = this.transpileSpecialStringFunction(functionName, ownerName);
                break;
            case "Array":

                break;

            case "Math":

                break;
        }

        // if a signature is available, take this and call it with the given arguments
        if (signature) {
            return `${signature}(${argumentStack.join(", ")})`;
        }

        // @todo: check for class method calls that uses : for non static and . for static calls

        // use the default access pattern
        return `${ownerName}.${functionName}(${argumentStack.join(", ")})`;
    }
}
