import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaTryStatement extends BaseTarget, Target { }
export class LuaTryStatement implements Partial<Target> {

    public transpileTryStatement(node: ts.TryStatement): string {

        // build two anonymous functions that can be passed to xpcall
        const tryHandler = [
            `function()`,
            this.addSpacesToString(this.transpileNode(node.tryBlock), 2),
            `end`
        ].join("\n");

        // now the catch function
        // get the error var name
        let errorVarName: string = "";
        if (node.catchClause && node.catchClause.variableDeclaration) {
            errorVarName = this.transpileNode(node.catchClause.variableDeclaration.name);
        }
        // build the function
        const catchHandler = [
            `function(${errorVarName})`,
            this.addSpacesToString(this.transpileNode(node.catchClause.block), 2),
            `end`
        ].join("\n");

        // build the try catch
        const tryCatch: string[] = [
            `xpcall(${tryHandler}, ${catchHandler})`
        ];

        // add the optional finally
        if (node.finallyBlock) {
            tryCatch.push(this.transpileNode(node.finallyBlock));
        }

        // force new line after try catch
        tryCatch.push("");

        // join by new line
        return tryCatch.join("\n");
    }
}
