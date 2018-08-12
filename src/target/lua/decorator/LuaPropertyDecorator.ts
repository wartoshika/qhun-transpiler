import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { LuaKeywords } from "../LuaKeywords";

export interface LuaPropertyDecorator extends BaseTarget, Target { }
export class LuaPropertyDecorator implements Partial<Target> {

    public transpilePropertyDecorator(node: ts.PropertyDeclaration): string {

        // get the property name
        const propertyName = this.transpileNode(node.name);

        // iterate over existing decorators
        return node.decorators.map(decorator => {

            // parse the expression of the decorator (the name)
            const decoratorName = this.transpileNode(decorator.expression);

            // property decorators must pass the instance and the property key
            return `${decoratorName}(${LuaKeywords.CLASS_INSTANCE_LOCAL_NAME}, "${propertyName}")`;
        }).join("\n");
    }
}
