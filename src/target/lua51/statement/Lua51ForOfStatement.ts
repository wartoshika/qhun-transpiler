import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { ForOfStatement, VariableDeclarationList, VariableDeclaration } from "typescript";
import { UnsupportedNodeException } from "../../../exception/UnsupportedNodeException";

export class Lua51ForOfStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public forOfStatement(node: ForOfStatement): string {

        // get the initializer vars
        const initializers = (node.initializer as VariableDeclarationList).declarations;
        if (!Array.isArray(initializers) || initializers.length !== 1) {
            this.transpiler.registerError({
                node: node,
                message: `for .. of statements must have one initializer. There are currently ${initializers.length} initializers.`
            });
            return "[ERROR]";
        }

        // get the initializer variable name
        const initializerName = this.transpiler.transpileNode((initializers[0] as VariableDeclaration).name);

        // get the expression
        const expression = this.transpiler.transpileNode(node.expression);

        // if the expression element is an array type, use ipairs instead of pairs
        let iteratorFunction: string = "pairs";
        if (this.transpiler.typeHelper().isArray(node.expression)) {
            iteratorFunction = "ipairs";
        }

        // write the for of loop
        const forOfContent: string[] = [
            `for _,»${initializerName} in ${iteratorFunction}(»${expression}») do`,
            this.transpiler.addIntend(
                this.transpiler.transpileNode(node.statement)
            ),
            `end`
        ];

        // join by newline
        return forOfContent.join(this.transpiler.break());
    }
}