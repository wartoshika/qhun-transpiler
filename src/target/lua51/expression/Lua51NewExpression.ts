import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { NewExpression } from "typescript";
import { Lua51Keywords } from "../Lua51Keywords";

export class Lua51NewExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    private readonly CLASS_NEW_FUNCTION_NAME = this.transpiler.getConfig().obscurify ? Lua51Keywords.CLASS_NEW_FUNCTION_NAME_OBSCURIFY : Lua51Keywords.CLASS_NEW_FUNCTION_NAME;

    /**
     * @inheritdoc
     */
    public newExpression(node: NewExpression): string {

        // get the called class name
        const className = this.transpiler.transpileNode(node.expression);

        // build the parameter stack
        const paramStack: string[] = [
            "true",
            ...(node.arguments ? node.arguments.map(arg => this.transpiler.transpileNode(arg)) : [])
        ];

        // use the new method on the class
        return `${className}.${this.CLASS_NEW_FUNCTION_NAME}(»${paramStack.join(`,»`)}»)`;
    }
}