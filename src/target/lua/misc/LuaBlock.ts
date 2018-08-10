import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaBlock extends BaseTarget, Target { }
export class LuaBlock implements Partial<Target> {

    public transpileBlock(node: ts.Block): string {

        // evaluate every block statement als transpile this statement
        const statementStack: string[] = [];
        node.statements.some(statement => {

            // transpile the statement
            statementStack.push(this.transpileNode(statement));

            // stop when the return statement is here
            return ts.isReturnStatement(statement);
        });

        // join statements by new line character
        return statementStack.join("\n");
    }
}
