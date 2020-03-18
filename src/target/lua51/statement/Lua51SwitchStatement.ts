import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { SwitchStatement, isReturnStatement, NodeArray, Statement, createNodeArray, SyntaxKind, DefaultClause, isCaseClause, createBlock, isDefaultClause, CaseClause, createBinary, createIf } from "typescript";

export class Lua51SwitchStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public switchStatement(node: SwitchStatement): string {

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
    private switchStatementHasReturnCases(node: SwitchStatement): boolean {

        return node.caseBlock.clauses.some(clause => clause.statements.some(isReturnStatement));
    }

    /**
     * removes the break statement from the given statement list
     * @param statements the current statements
     */
    private removeBreakStatement(statements: NodeArray<Statement>): NodeArray<Statement> {

        return createNodeArray(statements.filter(statement => statement.kind !== SyntaxKind.BreakStatement));
    }

    /**
     * transpiles the switch statement using table style implementation
     * @param node the switch to transpile
     */
    private transpileSwitchStatementTableStyle(node: SwitchStatement): string {

        // get the expression
        const expression = this.transpiler.transpileNode(node.expression);

        // get all cases
        let defaultCase: DefaultClause | undefined;
        const cases: string[] = node.caseBlock.clauses.map(clause => {

            // get case identifier
            if (isCaseClause(clause)) {
                const caseIdentifier = this.transpiler.transpileNode(clause.expression);
                const caseExpression = this.transpiler.transpileNode(createBlock(this.removeBreakStatement(clause.statements)));

                // use a computed object property assignment as case block
                return [
                    `[»${caseIdentifier}»]»=»function()`,
                    this.transpiler.addIntend(caseExpression),
                    `end`
                ].join(this.transpiler.break());
            }
            if (isDefaultClause(clause)) {
                defaultCase = clause;
                return "";
            }
        }).filter(line => !!line) as string[];

        // check if there is a default case
        let defaultOrEnd: string = "end";
        if (defaultCase) {
            defaultOrEnd = [
                `else`,
                this.transpiler.addIntend(
                    this.transpiler.transpileNode(
                        createBlock(
                            this.removeBreakStatement(defaultCase.statements)
                        )
                    )
                ),
                `end`
            ].join(this.transpiler.break());
        }

        // generate a switch variable
        const switchVar = this.transpiler.generateUniqueIdentifier("switch");

        // build the switch object
        return [
            `local ${switchVar}»=»{`,
            this.transpiler.addIntend(cases.join(`,${this.transpiler.break()}`)),
            `}`,
            `if type»(»${switchVar}[»${expression}»]»)»==»"function" then`,
            this.transpiler.addIntend(`${switchVar}[»${expression}»](»)`),
            defaultOrEnd
        ].join(this.transpiler.break());
    }

    /**
     * transpiles the switch statement using if style implementation
     * @param node the switch to transpile
     */
    private transpileSwitchStatementIfStyle(node: SwitchStatement): string {

        // get the default case is available
        const defaultCase = node.caseBlock.clauses.filter(isDefaultClause);

        // declare a case stack
        const cases = node.caseBlock.clauses.filter(clause => !isDefaultClause(clause));
        const ifDataStack = cases.map((clause: CaseClause, index) => {

            // create a binary equal expression
            const binaryEqual = createBinary(node.expression, SyntaxKind.EqualsEqualsEqualsToken, clause.expression);

            // add the default case if this is the last clause and a default case is present
            let elseStatement: Statement | undefined;
            if (index === cases.length - 1 && defaultCase.length === 1) {
                elseStatement = createBlock(defaultCase[0].statements);
            }

            // return the data and remove the break part
            return createIf(binaryEqual, createBlock(this.removeBreakStatement(clause.statements)), elseStatement);
        });

        // now reduce the ifDataStack to a global if statement
        const ifStatement = ifDataStack.reduceRight((previous, current) => {

            return createIf(current.expression, current.thenStatement, createIf(previous.expression, previous.thenStatement, previous.elseStatement));
        });

        // transpile the complete if statement
        return this.transpiler.transpileNode(ifStatement);
    }
}