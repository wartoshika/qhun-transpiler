import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";
import { LuaKeywords } from "../LuaKeywords";

export interface LuaClassDecorator extends BaseTarget, Target { }
export class LuaClassDecorator implements Partial<Target> {

    public transpileClassDecorator(node: ts.ClassDeclaration): string {

        const decoratorLines: string[] = [];

        if (node.decorators && node.decorators.length > 0) {

            // get class name
            const className = this.transpileNode(node.name);

            if (!className) {
                throw new UnsupportedError(`Class decorators on an anonymous class is not supported!`, node);
            }

            // a class decorator is like a constructor function replacement
            // use a variable assignment as base
            decoratorLines.push(...node.decorators.map(decorator => {

                return this.transpileNode(ts.createAssignment(
                    ts.createPropertyAccess(ts.createIdentifier(className), ts.createIdentifier(LuaKeywords.CLASS_INIT_FUNCTION_NAME)),
                    ts.createCall(decorator.expression, [], [
                        node.name
                    ])
                ));
            }));

        }
        return decoratorLines.join("\n");
    }
}
