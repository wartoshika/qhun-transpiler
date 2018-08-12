import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { LuaKeywords } from "../LuaKeywords";

export interface LuaFunctionDecorator extends BaseTarget, Target { }
export class LuaFunctionDecorator implements Partial<Target> {

    public transpileFunctionDecorator(node: ts.FunctionDeclaration): string {

        // get the function name
        let functionName = this.transpileNode(node.name);

        // the function name contains the class name, remove it
        functionName = functionName.split(".")[1];

        // iterate over existing decorators
        return node.decorators.map(decorator => {

            // parse the expression of the decorator (the name)
            const decoratorName = this.transpileNode(decorator.expression);

            // property decorators must pass the instance and the property key
            return `${decoratorName}(self, "${functionName}", ${this.getFunctionDecoratorTypedPropertyDescriptor(node)})`;
        }).join("\n");
    }

    /**
     * get the TypedPropertyDescriptor for the method decorator
     * @param node the function declaration
     */
    private getFunctionDecoratorTypedPropertyDescriptor(node: ts.FunctionDeclaration): string {

        // create the descriptor as object literal
        const descriptor = ts.createObjectLiteral();

        // return the transpiled object
        return this.transpileNode(descriptor);
    }
}
