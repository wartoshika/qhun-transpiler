import { PartialTranspiler } from "./impl/PartialTranspiler";
import { Node, VariableStatement, ReturnStatement, IfStatement, WhileStatement, DoStatement, ForStatement, ForOfStatement, ForInStatement, SwitchStatement, BreakStatement, TryStatement, ThrowStatement, ContinueStatement, EmptyStatement, ExpressionStatement } from "typescript";

export interface StatementTranspiler extends PartialTranspiler {

    /**
     * transpiles a first statement node
     * @param node the node to transpile
     */
    firstStatement(node: Node): string;

    /**
     * transpiles a variable statement
     * @param node the node to transpile
     */
    variableStatement(node: VariableStatement): string;

    /**
     * transpiles a return statement
     * @param node the node to transpile
     */
    returnStatement(node: ReturnStatement): string;

    /**
     * transpiles an if statement
     * @param node the node to transpile
     */
    ifStatement(node: IfStatement): string;

    /**
     * transpiles a while statement
     * @param node the node to transpile
     */
    whileStatement(node: WhileStatement): string;

    /**
     * transpiles a do statement
     * @param node the node to transpile
     */
    doStatement(node: DoStatement): string;

    /**
     * transpiles a for statement
     * @param node the node to transpile
     */
    forStatement(node: ForStatement): string;

    /**
     * transpiles a for of statement
     * @param node the node to transpile
     */
    forOfStatement(node: ForOfStatement): string;

    /**
     * transpiles a for in statement
     * @param node the node to transpile
     */
    forInStatement(node: ForInStatement): string;

    /**
     * transpiles a switch statement
     * @param node the node to transpile
     */
    switchStatement(node: SwitchStatement): string;

    /**
     * transpiles a break statement
     * @param node the node to transpile
     */
    breakStatement(node: BreakStatement): string;

    /**
     * transpiles a try statement
     * @param node the node to transpile
     */
    tryStatement(node: TryStatement): string;

    /**
     * transpiles a throw statement
     * @param node the node to transpile
     */
    throwStatement(node: ThrowStatement): string;

    /**
     * transpiles a continue statement
     * @param node the node to transpile
     */
    continueStatement(node: ContinueStatement): string;

    /**
     * transpiles an empty statement
     * @param node the node to transpile
     */
    emptyStatement(node: EmptyStatement): string;

    /**
     * transpiles an expression statement
     * @param node the node to transpile
     */
    expressionStatement(node: ExpressionStatement): string;
}