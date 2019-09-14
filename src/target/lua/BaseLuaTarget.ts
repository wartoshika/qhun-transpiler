import { use } from "typescript-mix";
import { BaseTarget } from "../BaseTarget";
import { Target } from "../Target";
import * as luaTrait from "./traits";

export interface BaseLuaTarget extends BaseTarget, Target,
    luaTrait.LuaDeclarations, luaTrait.LuaDeclarations, luaTrait.LuaExpressions, luaTrait.LuaMisc,
    luaTrait.LuaSpecial, luaTrait.LuaDecorators { }

export abstract class BaseLuaTarget extends BaseTarget implements Target {

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
        luaTrait.LuaClassExpression,
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
        luaTrait.LuaVariableDeclarationList,
        luaTrait.LuaArrayBindingPattern,
        luaTrait.LuaObjectBindingPattern,
        luaTrait.LuaSpreadElement,
        luaTrait.LuaRegularExpressionLiteral,
        // special
        luaTrait.LuaStringSpecial,
        luaTrait.LuaObjectSpecial,
        luaTrait.LuaArraySpecial,
        luaTrait.LuaMathSpecial,
        luaTrait.LuaFunctionSpecial,
        // decorator
        luaTrait.LuaClassDecorator,
        luaTrait.LuaFunctionDecorator,
        luaTrait.LuaParameterDecorator,
        luaTrait.LuaPropertyDecorator
    ) protected this: BaseLuaTarget;
}
