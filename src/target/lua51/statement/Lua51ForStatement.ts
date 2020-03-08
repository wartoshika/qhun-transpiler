import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { ForStatement, VariableDeclarationList, SyntaxKind } from "typescript";
import { UnsupportedNodeException } from "../../../exception/UnsupportedNodeException";

export class Lua51ForStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public forStatement(node: ForStatement): string {

        // get all initializers
        const initializerStack: string[] = (node.initializer as VariableDeclarationList).declarations
            .map(init => this.transpiler.transpileNode(init));

        // get condition
        if (!node.condition) {
            throw new UnsupportedNodeException(`${SyntaxKind[SyntaxKind.ForStatement]} without a condition is not supported!`, node);
        }
        const condition = this.transpiler.transpileNode(node.condition);

        // get body
        const body = this.transpiler.transpileNode(node.statement);

        // get incrementor
        if (!node.incrementor) {
            throw new UnsupportedNodeException(`${SyntaxKind[SyntaxKind.ForStatement]} without an incrementor is not supported!`, node);
        }
        const incrementor = this.transpiler.transpileNode(node.incrementor);

        // put everything together
        return [
            `do`,
            this.transpiler.addIntend([
                ...initializerStack
            ].join(this.transpiler.break())),
            this.transpiler.addIntend(`while ${condition} do`),
            this.transpiler.addIntend(body, 2),
            // add the incrementor
            this.transpiler.addIntend(incrementor, 2),
            this.transpiler.addIntend(`end`),
            `end`
        ].join(this.transpiler.break());
    }
}