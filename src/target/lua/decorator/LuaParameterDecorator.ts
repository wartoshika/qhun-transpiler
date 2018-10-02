import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaParameterDecorator extends BaseTarget, Target { }
export class LuaParameterDecorator implements Partial<Target> {

    public transpileParameterDecorator(node: ts.ParameterDeclaration): string {

        // check if decorators are present
        if (!node.decorators || node.decorators.length < 1) {
            return "";
        }

        // get required data for the decorator
        const paramName = this.transpileNode(node.name);
        const target = this.transpileNode(ts.createThis());
        const propertyKey = this.transpileNode(node.parent.name);
        const paramIndex = node.parent.parameters.indexOf(node);

        // parse every decorator
        return node.decorators.map(dec => {

            return `${paramName} = ${this.transpileNode(dec.expression)}(${target}, "${propertyKey}", ${paramIndex})`;
        }).join("\n");
    }
}
