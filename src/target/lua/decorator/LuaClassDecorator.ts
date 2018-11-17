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

                const decoratorAssignmentName = this.generateUniqueVariableName("decoratorAssignment");

                // transpile the assignment expression for the new init function
                const transpiledAssignment = this.transpileNode(ts.createAssignment(
                    ts.createPropertyAccess(ts.createIdentifier(className), ts.createIdentifier(LuaKeywords.CLASS_INIT_FUNCTION_NAME)),
                    ts.createIdentifier(decoratorAssignmentName)
                ));

                // transpile an assignment expression for the alternative constructor function
                const transpiledAssignmentAlternativeConstructor = this.transpileNode(ts.createAssignment(
                    ts.createPropertyAccess(ts.createIdentifier(className), ts.createIdentifier(LuaKeywords.CLASS_NEW_FUNCTION_NAME)),
                    ts.createPropertyAccess(ts.createIdentifier(decoratorAssignmentName), ts.createIdentifier(LuaKeywords.CLASS_NEW_FUNCTION_NAME)),
                ));

                return [
                    // assign the decorator result to a local variable
                    `local ${decoratorAssignmentName} = ${this.transpileNode(ts.createCall(decorator.expression, [], [node.name]))}`,
                    // check if the result is a function, nil or a class
                    `if type(${decoratorAssignmentName}) == "function" then`,
                    // add the assignment expression to override the constructor by function reference
                    this.addSpacesToString(transpiledAssignment, 2),
                    // when the value is a class
                    `elseif type(${decoratorAssignmentName}) == "table" then`,
                    // override the new method and point to the child class
                    this.addSpacesToString(transpiledAssignmentAlternativeConstructor, 2),
                    `end`
                    // when the result of the decorator is nil, nothing should be overwritten
                ].join("\n");
            }));

        }
        return decoratorLines.join("\n");
    }
}
