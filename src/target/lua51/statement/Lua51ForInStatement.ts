import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { ForInStatement, VariableDeclarationList, VariableDeclaration } from "typescript";

export class Lua51ForInStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public forInStatement(node: ForInStatement): string {

        // get the initializer vars
        const initializers = (node.initializer as VariableDeclarationList).declarations;
        if (!Array.isArray(initializers) || initializers.length !== 1) {
            this.transpiler.registerError({
                node: node,
                message: `for .. in statements must have one initializer. There are currently ${initializers.length} initializers.`
            });
            return "[ERROR]";
        }

        // for .. in is not supported for arrays
        if (this.transpiler.typeHelper().isArray(node.expression)) {
            this.transpiler.registerError({
                node: node.expression,
                message: `Iterating over arrays with a for .. in statement is not supported!`
            });
            return "[ERROR]";
        }

        // get the initializer variable name
        const initializerName = this.transpiler.transpileNode((initializers[0] as VariableDeclaration).name);

        // get the expression
        const expression = this.transpiler.transpileNode(node.expression);

        // get the loop body
        const body = this.transpiler.transpileNode(node.statement);

        // join everything
        return [
            `for ${initializerName},»_ in pairs(»${expression}») do`,
            this.transpiler.addIntend(body),
            `end`
        ].join(this.transpiler.break());
    }
}