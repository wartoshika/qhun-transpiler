import { AbstractStatementTranspiler } from "../../../transpiler/impl/AbstractStatementTranspiler";
import { Lua51FirstStatement } from "./Lua51FirstStatement";
import { Lua51VariableStatement } from "./Lua51VariableStatement";
import { Lua51ReturnStatement } from "./Lua51ReturnStatement";
import { Lua51IfStatement } from "./Lua51IfStatement";
import { Lua51WhileStatement } from "./Lua51WhileStatement";
import { Lua51DoStatement } from "./Lua51DoStatement";
import { Lua51ForStatement } from "./Lua51ForStatement";
import { Lua51ForOfStatement } from "./Lua51ForOfStatement";
import { Lua51ForInStatement } from "./Lua51ForInStatement";
import { Lua51SwitchStatement } from "./Lua51SwitchStatement";
import { Lua51BreakStatement } from "./Lua51BreakStatement";
import { Lua51TryStatement } from "./Lua51TryStatement";
import { Lua51ThrowStatement } from "./Lua51ThrowStatement";
import { Lua51ContinueStatement } from "./Lua51ContinueStatement";
import { Lua51EmptyStatement } from "./Lua51EmptyStatement";
import { Lua51ExpressionStatement } from "./Lua51ExpressionStatement";

export class Lua51StatementTranspiler extends AbstractStatementTranspiler {

    protected transpilerFunctions = {
        firstStatement: Lua51FirstStatement,
        variableStatement: Lua51VariableStatement,
        returnStatement: Lua51ReturnStatement,
        ifStatement: Lua51IfStatement,
        whileStatement: Lua51WhileStatement,
        doStatement: Lua51DoStatement,
        forStatement: Lua51ForStatement,
        forOfStatement: Lua51ForOfStatement,
        forInStatement: Lua51ForInStatement,
        switchStatement: Lua51SwitchStatement,
        breakStatement: Lua51BreakStatement,
        tryStatement: Lua51TryStatement,
        throwStatement: Lua51ThrowStatement,
        continueStatement: Lua51ContinueStatement,
        emptyStatement: Lua51EmptyStatement,
        expressionStatement: Lua51ExpressionStatement
    };
}