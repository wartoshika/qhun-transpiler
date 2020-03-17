import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { DeclarationTranspiler } from "../../../transpiler";
import { FunctionDeclaration, SyntaxKind } from "typescript";

export class Lua51FunctionDeclaration extends PartialTranspiler implements Partial<DeclarationTranspiler> {

    /**
     * @inheritdoc
     */
    public functionDeclaration(node: FunctionDeclaration): string {

        // if there is no function body, dont transpile. this is a function overload
        if (!node.body) {
            return "";
        }

        // get function name
        const name = node.name ? this.transpiler.transpileNode(node.name) : "";

        // check for exports
        if (name.length > 0 && this.transpiler.typeHelper().hasExportModifier(node)) {
            this.transpiler.registerExport(name);
        }

        // get all declared parameters
        let restArgumentName: string = "";
        const paramStack: string[] = node.parameters.map(param => {

            // get param name
            const paramName = this.transpiler.transpileNode(param.name);

            // add the argument or spread element
            let parameterType = this.transpiler.typeOfNode(param);
            if (parameterType.length > 0) {
                parameterType = this.transpiler.space() + parameterType;
            }
            if (param.dotDotDotToken) {
                restArgumentName = paramName;
                return "..." + parameterType;
            } else {
                return paramName + parameterType;
            }
        });

        // get parameter initializers
        const paramInitializer: string[] = node.parameters
            .filter(param => !!param.initializer)
            .map(param => {
                const paramName = this.transpiler.transpileNode(param.name);
                const initializerValue = this.transpiler.transpileNode(param.initializer!);
                return [
                    "if", " ", paramName, this.transpiler.space(), "==", this.transpiler.space(), "nil", " ", "then",
                    this.transpiler.break(),
                    this.transpiler.addIntend(
                        [paramName, this.transpiler.space(), "=", this.transpiler.space(), initializerValue].join("")
                    ),
                    this.transpiler.break(),
                    "end"
                ].join("");
            });

        // check for parameter decorators
        const paramDecorator: string[] = node.parameters
            .filter(param => param.decorators && param.decorators.length > 0)
            .map(param => this.transpiler.decorator().parameterDecorator(param));

        // add some body head
        const bodyHead: string[] = [];

        // add method decorators
        if (node.decorators && node.decorators.length > 0) {
            bodyHead.push(this.transpiler.decorator().functionDecorator(node));
        }

        // add initializers
        if (paramInitializer.length > 0) {
            bodyHead.push(paramInitializer.join(this.transpiler.break()));
        }

        // add parameter decorators
        if (paramDecorator.length > 0) {
            bodyHead.push(paramDecorator.join(this.transpiler.break()));
        }

        // add rest argument if available
        if (restArgumentName.length > 0) {
            bodyHead.push(`local ${restArgumentName}»=»{»...»}`);
        }

        // add parameters with visibility modifier
        const visibilityParams = node.parameters
            .filter(this.transpiler.typeHelper().hasExplicitVisibility)
            .map(param => {
                const paramName = this.transpiler.transpileNode(param.name);
                return `self.${paramName}»=»${paramName}`;
            });

        // add those params
        if (visibilityParams.length > 0) {
            bodyHead.push(visibilityParams.join(this.transpiler.break()));
        }

        // get the function body
        let body = this.transpiler.transpileNode(node.body);

        // check for shorthand arrow function usage eg: (x) => x + 1
        if (node.body && (node.body.kind as SyntaxKind) !== SyntaxKind.Block) {

            // add a return statement to ensure the shorthand call is correctly transpiled
            body = `return ${this.transpiler.transpileNode(node.body)}`;
        }

        // add the head before the body
        body = (bodyHead.length > 0 ? bodyHead.join(this.transpiler.break()) + this.transpiler.break() : "") + body;

        // try to get the return type of the declared function
        let returnType = node.type ? this.transpiler.typeOfNode(node.type) : "";
        if (returnType.length > 0) {
            returnType = `»${returnType.replace("[[", "[[ Returns")}`
        }

        // put everything together
        const code: string[] = [];
        code.push(`local function ${name}${name.length > 0 ? this.transpiler.space() : ""}(»`);
        code.push(paramStack.join(`,»`));
        code.push(`${paramStack.length > 0 ? this.transpiler.space() : ""})${returnType}`);
        code.push(this.transpiler.breakNoSpace());
        if (body.length > 0) {
            code.push(this.transpiler.addIntend(body));
            code.push(this.transpiler.break());
        }
        code.push("end");
        return code.join("");
    }
}