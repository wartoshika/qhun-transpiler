import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaFunctionExpression extends BaseTarget, Target { }
export class LuaFunctionExpression implements Partial<Target> {

    public transpileFunctionExpression(node: ts.FunctionExpression | ts.ArrowFunction): string {

        // reuse the function declaration for function and arrow function expressions
        const functionDeclaration = this.transpileFunctionDeclaration(ts.createFunctionDeclaration(
            node.decorators,
            node.modifiers,
            node.asteriskToken,
            node.name,
            node.typeParameters,
            node.parameters,
            node.type,
            node.body as ts.Block
        ));

        // remove the local prefix and the new line char
        return functionDeclaration.substring(
            functionDeclaration.indexOf("local ") + 6,
            functionDeclaration.length - 1
        );
    }
}
