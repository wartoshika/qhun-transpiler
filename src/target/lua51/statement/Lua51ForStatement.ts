import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { ForStatement, VariableDeclarationList, SyntaxKind } from "typescript";

export class Lua51ForStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public forStatement(node: ForStatement): string {

        // get all initializers
        const initializerStack: string[] = [];
        if (node.initializer && node.initializer.kind === SyntaxKind.BinaryExpression) {

            initializerStack.push(this.transpiler.transpileNode(node.initializer));
        } else if (node.initializer && node.initializer.kind === SyntaxKind.VariableDeclarationList) {

            initializerStack.push(
                ...(node.initializer as VariableDeclarationList).declarations
                    .map(init => this.transpiler.transpileNode(init))
            );
        } else {

            this.transpiler.registerError({
                node: node.initializer ? node.initializer : node,
                message: `Given initializer for a for statement is not supported!`
            });
            initializerStack.push("[ERROR]");
        }

        // get condition
        if (!node.condition) {
            this.transpiler.registerError({
                node: node,
                message: `${SyntaxKind[SyntaxKind.ForStatement]} without a condition is not supported!`
            });
            return "[ERROR]";
        }
        const condition = this.transpiler.transpileNode(node.condition);

        // get body
        const body = this.transpiler.transpileNode(node.statement);

        // get incrementor
        if (!node.incrementor) {
            this.transpiler.registerError({
                node: node,
                message: `${SyntaxKind[SyntaxKind.ForStatement]} without an incrementor is not supported!`
            });
            return "[ERROR]";
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