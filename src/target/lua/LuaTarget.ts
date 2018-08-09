import { Target } from "../Target";
import { BaseTarget } from "../BaseTarget";
import * as luaTrait from "./traits";

import * as ts from "typescript";
import { use } from "typescript-mix";

export interface LuaTarget extends BaseTarget, Target, luaTrait.LuaDeclarations, luaTrait.LuaDeclarations, luaTrait.LuaExpressions, luaTrait.LuaMisc { }

/**
 * the lua target
 */
export class LuaTarget extends BaseTarget implements Target {

    /**
     * import traits
     */
    @use(
        // declarations
        luaTrait.LuaClassDeclaration,
        luaTrait.LuaEnumDeclaration,
        luaTrait.LuaFunctionDeclaration,
        luaTrait.LuaImportDeclaration,
        luaTrait.LuaModuleDeclaration,
        luaTrait.LuaTypeAliasDeclaration,
        luaTrait.LuaInterfaceDeclaration,
        luaTrait.LuaExportDeclaration,
        luaTrait.LuaImportEqualsDeclaration,
        luaTrait.LuaVariableDeclaration,
        // statements
        luaTrait.LuaVariableStatement,
        luaTrait.LuaReturnStatement,
        luaTrait.LuaIfStatement,
        luaTrait.LuaWhileStatement,
        luaTrait.LuaDoStatement,
        luaTrait.LuaForStatement,
        luaTrait.LuaForOfStatement,
        luaTrait.LuaForInStatement,
        luaTrait.LuaSwitchStatement,
        luaTrait.LuaBreakStatement,
        luaTrait.LuaTryStatement,
        luaTrait.LuaThrowStatement,
        luaTrait.LuaContinueStatement,
        luaTrait.LuaEmptyStatement,
        // expressions
        luaTrait.LuaBinaryExpression,
        luaTrait.LuaConditionalExpression,
        luaTrait.LuaCallExpression,
        luaTrait.LuaPropertyAccessExpression,
        luaTrait.LuaElementAccessExpression,
        luaTrait.LuaTemplateExpression,
        luaTrait.LuaPostfixUnaryExpression,
        luaTrait.LuaPrefixUnaryExpression,
        luaTrait.LuaObjectLiteralExpression,
        luaTrait.LuaArrayLiteralExpression,
        luaTrait.LuaDeleteExpression,
        luaTrait.LuaFunctionExpression,
        luaTrait.LuaNewExpression,
        luaTrait.LuaParenthesizedExpression,
        luaTrait.LuaAsExpression,
        luaTrait.LuaTypeOfExpression,
        // misc
        luaTrait.LuaBlock,
        luaTrait.LuaEndOfFileToken,
        luaTrait.LuaIdentifier,
        luaTrait.LuaStringLiteral,
        luaTrait.LuaNumericLiteral,
        luaTrait.LuaKeyword,
        luaTrait.LuaComputedPropertyName,
        luaTrait.LuaTypeAssertion,
        luaTrait.LuaExportAssignment,
        luaTrait.LuaVariableDeclarationList
    ) protected this: LuaTarget;

    /**
     * a function that is called before the transpiling process begins
     */
    public preTranspile(): string | void {
        return "";
    }

    /**
     * a function that is called after the end of file token and directly after the transpiling process
     */
    public postTranspile(): string | void {
        return "";
    }

}
