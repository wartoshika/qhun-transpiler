import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaForStatement extends BaseTarget, Target { }
export class LuaForStatement implements Partial<Target> {

    public transpileForStatement(node: ts.ForStatement): string {

        // get all initializers
        const initializerStack: string[] = (node.initializer as ts.VariableDeclarationList).declarations
            .map(init => this.transpileVariableDeclaration(init));

        // get condition
        const condition = this.transpileNode(node.condition);

        // get body
        const body = this.transpileNode(node.statement);

        // get incrementor
        const incrementor = this.transpileNode(node.incrementor);

        // put everything together
        return [
            `do`,
            this.removeEmptyLines(this.addSpacesToString([
                ...initializerStack
            ].join("\n"), 2)),
            this.addSpacesToString(`while ${condition} do`, 2),
            this.removeEmptyLines(this.addSpacesToString(body, 4)),
            // add the incrementor
            this.addSpacesToString(incrementor, 4),
            this.addSpacesToString(`end`, 2),
            `end`
        ].join("\n");
    }
}
