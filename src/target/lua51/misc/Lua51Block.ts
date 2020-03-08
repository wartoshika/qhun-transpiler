import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { MiscTranspiler } from "../../../transpiler";
import { Block, isReturnStatement, isBreakStatement } from "typescript";

export class Lua51Block extends PartialTranspiler implements Partial<MiscTranspiler> {

    /**
     * @inheritdoc
     */
    public block(node: Block): string {

        // evaluate every block statement als transpile this statement
        const statementStack: string[] = [];
        node.statements.some(statement => {

            // transpile the statement
            statementStack.push(this.transpiler.transpileNode(statement));

            // stop when the return or break statement is here
            return isReturnStatement(statement) || isBreakStatement(statement);
        });

        // join statements by new line character
        return statementStack.join(this.transpiler.break());
    }
}