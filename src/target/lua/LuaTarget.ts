import { Target } from "../Target";
import { BaseTarget } from "../BaseTarget";
import * as luaTrait from "./traits";

import * as ts from "typescript";
import { use } from "typescript-mix";
import { LuaKeywords } from "./LuaKeywords";

export interface LuaTarget extends BaseTarget, Target,
    luaTrait.LuaDeclarations, luaTrait.LuaDeclarations, luaTrait.LuaExpressions, luaTrait.LuaMisc,
    luaTrait.LuaSpecial, luaTrait.LuaDecorators { }

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
        luaTrait.LuaVariableDeclarationList,
        luaTrait.LuaArrayBindingPattern,
        luaTrait.LuaObjectBindingPattern,
        luaTrait.LuaSpreadElement,
        // special
        luaTrait.LuaStringSpecial,
        luaTrait.LuaObjectSpecial,
        luaTrait.LuaArraySpecial,
        luaTrait.LuaMathSpecial,
        // decorator
        luaTrait.LuaClassDecorator,
        luaTrait.LuaFunctionDecorator,
        luaTrait.LuaParameterDecorator,
        luaTrait.LuaPropertyDecorator
    ) protected this: LuaTarget;

    /**
     * get the file extension of the target language
     */
    public getFileExtension(): string {
        return "lua";
    }

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
        return this.addDeclaredExports();
    }

    /**
     * add all declared exports to the transpiling context
     */
    private addDeclaredExports(): string {

        // get all declared exports
        const allExports = this.getExports();

        // check if there are no exports
        if (allExports.length === 0) {
            return "";
        }

        // divide between namespace exports and normal exports
        const normalExports = allExports.filter(exp => !exp.isNamespaceExport).map(exportNode => {
            return `${exportNode.name} = ${exportNode.name}`;
        });

        // now the namespace exports
        const namespaceExports = allExports.filter(exp => !!exp.isNamespaceExport).map(exportNode => {
            return `${LuaKeywords.EXPORT_LOCAL_NAME} = __global_requireall(${exportNode.name}, ${LuaKeywords.EXPORT_LOCAL_NAME})`;
        });

        // declare requireall when a namespace export is there
        if (namespaceExports.length > 0) {
            this.addDeclaration(
                "global.requireall",
                [
                    `local function __global_requireall(a,b)`,
                    this.addSpacesToString(`local mods = require(a)`, 2),
                    this.addSpacesToString(`for k, v in pairs(mods) do`, 2),
                    this.addSpacesToString(`b[k] = v`, 4),
                    this.addSpacesToString(`end`, 2),
                    this.addSpacesToString(`return b`, 2),
                    `end`
                ].join("\n")
            );
        }

        // iterate over all exports and wrap it as object literal
        const exportStatements: string[] = [
            `local ${LuaKeywords.EXPORT_LOCAL_NAME} = {`
        ];
        if (normalExports.length > 0) {
            exportStatements.push(this.addSpacesToString(normalExports.join(",\n"), 2));
        }
        exportStatements.push(`}`);
        if (namespaceExports.length > 0) {
            exportStatements.push(...namespaceExports);
        }
        exportStatements.push(`return ${LuaKeywords.EXPORT_LOCAL_NAME}`);

        // return the final result
        return exportStatements.join("\n");
    }

}
