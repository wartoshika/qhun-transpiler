import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { Types } from "../../../transpiler/Types";

export interface LuaFunctionDeclaration extends BaseTarget, Target { }
export class LuaFunctionDeclaration implements Partial<Target> {

    public transpileFunctionDeclaration(node: ts.FunctionDeclaration): string {

        // if there is no function body, dont transpile. this is a function overload
        if (!node.body) {
            return "";
        }

        // get function name
        const name = this.transpileNode(node.name);

        // check for exports
        if (this.hasExportModifier(node)) {
            this.addExport(name, node);
        }

        // get all declared parameters
        let restArgumentName: string;
        const paramStack: string[] = node.parameters.map(param => {

            // get param name
            const paramName = this.transpileNode(param.name);

            // add the argument or spread element
            if (param.dotDotDotToken) {
                restArgumentName = paramName;
                return "...";
            } else {
                return paramName;
            }
        });

        // get parameter initializers
        const paramInitializer: string[] = node.parameters
            .filter(param => !!param.initializer)
            .map(param => {
                const paramName = this.transpileNode(param.name);
                return `if ${paramName} == nil then ${paramName} = ${this.transpileNode(param.initializer)} end`;
            });

        // add some body head
        const bodyHead: string[] = [];

        // add method decorators
        if (node.decorators && node.decorators.length > 0) {
            bodyHead.push(this.transpileFunctionDecorator(node));
        }

        // add initializers
        if (paramInitializer.length > 0) {
            bodyHead.push(paramInitializer.join("\n"));
        }

        // add rest argument if available
        if (restArgumentName) {
            bodyHead.push(`local ${restArgumentName} = {...}`);
        }

        // add parameters with visibility modifier
        const visibilityParams = node.parameters
            .filter(Types.hasExplicitVisibility)
            .map(param => {
                const paramName = this.transpileNode(param.name);
                return `self.${paramName} = ${paramName}`;
            });

        // add those params
        if (visibilityParams.length > 0) {
            bodyHead.push(visibilityParams.join("\n"));
        }

        // get the function body
        let body = this.transpileNode(node.body);

        // add the head before the body
        body = bodyHead.join("\n") + "\n" + body;

        // put everything together
        return this.removeEmptyLines([
            // function head
            [
                `local function ${name}(`,
                paramStack.join(", "),
                `)`
            ].join(""),
            // function body
            this.addSpacesToString(body, 2),
            // function tail
            `end`
        ].join("\n")) + "\n";
    }
}
