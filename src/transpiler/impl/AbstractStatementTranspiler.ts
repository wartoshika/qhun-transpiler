import { PartialTranspiler } from "./PartialTranspiler";
import { Node, VariableStatement, ReturnStatement, IfStatement, WhileStatement, DoStatement, ForStatement, ForOfStatement, ForInStatement, SwitchStatement, BreakStatement, TryStatement, ThrowStatement, ContinueStatement, EmptyStatement, ExpressionStatement } from "typescript";
import { PartialTranspilerConstructor } from "../../constraint";
import { StatementTranspiler } from "../StatementTranspiler";

declare type Statements = {
    [P in keyof AbstractStatementTranspiler]: AbstractStatementTranspiler[P] extends (node: Node) => string ? PartialTranspilerConstructor<StatementTranspiler, P> : never;
}

export abstract class AbstractStatementTranspiler extends PartialTranspiler implements StatementTranspiler {

    protected abstract transpilerFunctions: Statements;

    private classStorage: {
        [P in keyof Statements]?: any
    } = {};

    /**
     * @inheritdoc
     */
    public firstStatement(node: Node): string {
        return this.constructClass("firstStatement").firstStatement(node);
    }

    /**
     * @inheritdoc
     */
    public variableStatement(node: VariableStatement): string {
        return this.constructClass("variableStatement").variableStatement(node);
    }

    /**
     * @inheritdoc
     */
    public returnStatement(node: ReturnStatement): string {
        return this.constructClass("returnStatement").returnStatement(node);
    }

    /**
     * @inheritdoc
     */
    public ifStatement(node: IfStatement): string {
        return this.constructClass("ifStatement").ifStatement(node);
    }

    /**
     * @inheritdoc
     */
    public whileStatement(node: WhileStatement): string {
        return this.constructClass("whileStatement").whileStatement(node);
    }

    /**
     * @inheritdoc
     */
    public doStatement(node: DoStatement): string {
        return this.constructClass("doStatement").doStatement(node);
    }

    /**
     * @inheritdoc
     */
    public forStatement(node: ForStatement): string {
        return this.constructClass("forStatement").forStatement(node);
    }

    /**
     * @inheritdoc
     */
    public forOfStatement(node: ForOfStatement): string {
        return this.constructClass("forOfStatement").forOfStatement(node);
    }

    /**
     * @inheritdoc
     */
    public forInStatement(node: ForInStatement): string {
        return this.constructClass("forInStatement").forInStatement(node);
    }

    /**
     * @inheritdoc
     */
    public switchStatement(node: SwitchStatement): string {
        return this.constructClass("switchStatement").switchStatement(node);
    }

    /**
     * @inheritdoc
     */
    public breakStatement(node: BreakStatement): string {
        return this.constructClass("breakStatement").breakStatement(node);
    }

    /**
     * @inheritdoc
     */
    public tryStatement(node: TryStatement): string {
        return this.constructClass("tryStatement").tryStatement(node);
    }

    /**
     * @inheritdoc
     */
    public throwStatement(node: ThrowStatement): string {
        return this.constructClass("throwStatement").throwStatement(node);
    }

    /**
     * @inheritdoc
     */
    public continueStatement(node: ContinueStatement): string {
        return this.constructClass("continueStatement").continueStatement(node);
    }

    /**
     * @inheritdoc
     */
    public emptyStatement(node: EmptyStatement): string {
        return this.constructClass("emptyStatement").emptyStatement(node);
    }

    /**
     * @inheritdoc
     */
    public expressionStatement(node: ExpressionStatement): string {
        return this.constructClass("expressionStatement").expressionStatement(node);
    }

    /**
     * constructs the given class and store the result. return from the cache if already constructed
     * @param transpilerClass 
     */
    private constructClass<A extends keyof Statements>(part: A): InstanceType<Statements[A]> {

        if (this.classStorage[part] === undefined) {
            this.classStorage[part] = new this.transpilerFunctions[part](this.transpiler);
        }
        return this.classStorage[part];
    }
}