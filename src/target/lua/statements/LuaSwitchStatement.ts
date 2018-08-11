import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaSwitchStatement extends BaseTarget, Target { }
export class LuaSwitchStatement implements Partial<Target> {

    public transpileSwitchStatement(node: ts.SwitchStatement): string {

        // get the expression
        const expression = this.transpileNode(node.expression);

        // get all cases
        let defaultCase: ts.DefaultClause;
        const cases: string[] = node.caseBlock.clauses.map(clause => {

            // check if this clause contains a return statement. this
            // is currently unsupported
            if (clause.statements.some(ts.isReturnStatement)) {
                throw new UnsupportedError(`Return statements in a switch context is unsupported!`, clause);
            }

            // get case identifier
            if (ts.isCaseClause(clause)) {
                const caseIdentifier = this.transpileNode(clause.expression);
                const caseExpression = this.transpileNode(ts.createBlock(this.removeBreakStatement(clause.statements)));

                // use a computed object property assignment as case block
                return [
                    `[${caseIdentifier}] = function()`,
                    this.addSpacesToString(caseExpression, 2),
                    `end`
                ].join("\n");
            }
            if (ts.isDefaultClause(clause)) {
                defaultCase = clause;
                return "";
            }
        }).filter(line => !!line);

        // check if there is a default case
        let defaultOrEnd: string = "end";
        if (defaultCase) {
            defaultOrEnd = [
                `else`,
                this.addSpacesToString(
                    this.transpileNode(
                        ts.createBlock(
                            this.removeBreakStatement(defaultCase.statements)
                        )
                    ), 2
                ),
                `end`
            ].join("\n");
        }

        // build the switch object
        return [
            `local __switch = {`,
            this.addSpacesToString(cases.join(",\n"), 2),
            `}`,
            `if type(__switch[${expression}]) == "function" then`,
            `  __switch[${expression}]()`,
            defaultOrEnd
        ].join("\n");
    }

    /**
     * removes the break statement from the given statement list
     * @param statements the current statements
     */
    private removeBreakStatement(statements: ts.NodeArray<ts.Statement>): ts.NodeArray<ts.Statement> {

        return ts.createNodeArray(statements.filter(statement => statement.kind !== ts.SyntaxKind.BreakStatement));
    }
}
