import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaSwitchStatement extends BaseTarget, Target { }
export class LuaSwitchStatement implements Partial<Target> {

    public transpileSwitchStatement(node: ts.SwitchStatement): string {

        // there are two possabilities how to implement switch case like support for lua.
        // 1. Use the case as table index and a callback function as case body (fast)
        // 2. Use an if elseif elseif else statement (support for return statements but slow)
        // -----------------------
        // so use a table map switch for switch statements that do not need to return
        // and the slow implementation for statements that need to return
        if (this.switchStatementHasReturnCases(node)) {
            return this.transpileSwitchStatementIfStyle(node);
        } else {
            return this.transpileSwitchStatementTableStyle(node);
        }
    }

    /**
     * test is the given switch statement has some cases that need to return a value
     * @param node the switch to test
     */
    private switchStatementHasReturnCases(node: ts.SwitchStatement): boolean {

        return node.caseBlock.clauses.some(clause => clause.statements.some(ts.isReturnStatement));
    }

    /**
     * removes the break statement from the given statement list
     * @param statements the current statements
     */
    private removeBreakStatement(statements: ts.NodeArray<ts.Statement>): ts.NodeArray<ts.Statement> {

        return ts.createNodeArray(statements.filter(statement => statement.kind !== ts.SyntaxKind.BreakStatement));
    }

    /**
     * transpiles the switch statement using table style implementation
     * @param node the switch to transpile
     */
    private transpileSwitchStatementTableStyle(node: ts.SwitchStatement): string {

        // get the expression
        const expression = this.transpileNode(node.expression);

        // get all cases
        let defaultCase: ts.DefaultClause;
        const cases: string[] = node.caseBlock.clauses.map(clause => {

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

        // generate a switch variable
        const switchVar = this.generateUniqueVariableName("switch");

        // build the switch object
        return [
            `local ${switchVar} = {`,
            this.addSpacesToString(cases.join(",\n"), 2),
            `}`,
            `if type(${switchVar}[${expression}]) == "function" then`,
            `  ${switchVar}[${expression}]()`,
            defaultOrEnd
        ].join("\n");
    }

    /**
     * transpiles the switch statement using if style implementation
     * @param node the switch to transpile
     */
    private transpileSwitchStatementIfStyle(node: ts.SwitchStatement): string {

        // get the expression
        const expression = this.transpileNode(node.expression);

        // get the default case is available
        const defaultCase = node.caseBlock.clauses.filter(ts.isDefaultClause);

        // declare a case stack
        const cases = node.caseBlock.clauses.filter(clause => !ts.isDefaultClause(clause));
        const ifDataStack = cases.map((clause: ts.CaseClause, index) => {

            // create a binary equal expression
            const binaryEqual = ts.createBinary(node.expression, ts.SyntaxKind.EqualsEqualsEqualsToken, clause.expression);

            // add the default case if this is the last clause and a default case is present
            let elseStatement: ts.Statement;
            if (index === cases.length - 1 && defaultCase.length === 1) {
                elseStatement = ts.createBlock(defaultCase[0].statements);
            }

            // return the data and remove the break part
            return ts.createIf(binaryEqual, ts.createBlock(this.removeBreakStatement(clause.statements)), elseStatement);
        });

        // now reduce the ifDataStack to a global if statement
        const ifStatement = ifDataStack.reduceRight((previous, current) => {

            return ts.createIf(current.expression, current.thenStatement, ts.createIf(previous.expression, previous.thenStatement, previous.elseStatement));
        });

        // transpile the complete if statement
        return this.transpileNode(ifStatement);
    }
}
