import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaFunctionDeclaration extends BaseTarget, Target { }
export class LuaFunctionDeclaration implements Partial<Target> {

    public transpileFunctionDeclaration(node: ts.FunctionDeclaration): string {

        // if there is no function body, dont transpile. this is a function overload
        if (!node.body) {
            return "";
        }

        // get function name
        const name = this.transpileNode(node.name);

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

        // get the function body
        let body = this.transpileNode(node.body);

        // add initializers
        if (paramInitializer.length > 0) {
            body = paramInitializer.join("\n") + "\n" + body;
        }

        // add rest argument if available
        if (restArgumentName) {
            body = `local ${restArgumentName} = {...}\n${body}`;
        }

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
        ].join("\n"));
    }
}
