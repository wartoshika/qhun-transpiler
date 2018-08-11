import * as ts from "typescript";
import { Target } from "../target/Target";
import { UnsupportedError } from "../error/UnsupportedError";

/**
 * the transpiler that transpiles typescript into a given target language
 */
export class Transpiler {

    /**
     * @param target the target language
     */
    constructor(
        private target: Target
    ) {

        // bind the node transpiler
        target.setNodeTranspiler(this.transpileNode.bind(this));
    }

    /**
     * transpiles the given file into the target language
     * @param sourceFile the source file to transpile
     * @returns the transpiles source code
     */
    public transpile(sourceFile: ts.SourceFile): string {

        // the transpiled sourcecode will be stored in result
        let result = this.target.preTranspile() || "";

        // iterate over every statement in the sourcefile
        sourceFile.statements.forEach(statement => {

            result += this.transpileNode(statement);
        });

        // add post transpile
        result += this.target.postTranspile() || "";

        // return the final result
        return result;
    }

    /**
     * transpiles the given node
     * @param node the node to transpile
     */
    private transpileNode(node: ts.Node): string {

        // check for an empty node
        if (!node) {
            return "";
        }

        // check the node kind and decide what to do with this node kind
        switch (node.kind) {
            case ts.SyntaxKind.ImportDeclaration:
                return this.target.transpileImportDeclaration(node as ts.ImportDeclaration);
            case ts.SyntaxKind.ClassDeclaration:
                return this.target.transpileClassDeclaration(node as ts.ClassDeclaration);
            case ts.SyntaxKind.ModuleDeclaration:
                return this.target.transpileModuleDeclaration(node as ts.ModuleDeclaration);
            case ts.SyntaxKind.ModuleBlock:
                return this.target.transpileBlock(node as ts.Block);
            case ts.SyntaxKind.EnumDeclaration:
                return this.target.transpileEnumDeclaration(node as ts.EnumDeclaration);
            case ts.SyntaxKind.FunctionDeclaration:
                return this.target.transpileFunctionDeclaration(node as ts.FunctionDeclaration);
            case ts.SyntaxKind.VariableStatement:
                return this.target.transpileVariableStatement(node as ts.VariableStatement);
            case ts.SyntaxKind.VariableDeclarationList:
                return this.target.transpileVariableDeclarationList(node as ts.VariableDeclarationList);
            case ts.SyntaxKind.VariableDeclaration:
                return this.target.transpileVariableDeclaration(node as ts.VariableDeclaration);
            case ts.SyntaxKind.ExpressionStatement:
                return this.transpileNode((node as ts.ExpressionStatement).expression);
            case ts.SyntaxKind.ReturnStatement:
                return this.target.transpileReturnStatement(node as ts.ReturnStatement);
            case ts.SyntaxKind.Block:
                return this.target.transpileBlock(node as ts.Block);
            case ts.SyntaxKind.IfStatement:
                return this.target.transpileIfStatement(node as ts.IfStatement);
            case ts.SyntaxKind.WhileStatement:
                return this.target.transpileWhileStatement(node as ts.WhileStatement);
            case ts.SyntaxKind.DoStatement:
                return this.target.transpileDoStatement(node as ts.DoStatement);
            case ts.SyntaxKind.ForStatement:
                return this.target.transpileForStatement(node as ts.ForStatement);
            case ts.SyntaxKind.ForOfStatement:
                return this.target.transpileForOfStatement(node as ts.ForOfStatement);
            case ts.SyntaxKind.ForInStatement:
                return this.target.transpileForInStatement(node as ts.ForInStatement);
            case ts.SyntaxKind.SwitchStatement:
                return this.target.transpileSwitchStatement(node as ts.SwitchStatement);
            case ts.SyntaxKind.BreakStatement:
                return this.target.transpileBreakStatement(node as ts.BreakStatement);
            case ts.SyntaxKind.TryStatement:
                return this.target.transpileTryStatement(node as ts.TryStatement);
            case ts.SyntaxKind.ThrowKeyword:
                return this.target.transpileThrowStatement(node as ts.ThrowStatement);
            case ts.SyntaxKind.ContinueStatement:
                return this.target.transpileContinueStatement(node as ts.ContinueStatement);
            case ts.SyntaxKind.TypeAliasDeclaration:
                return this.target.transpileTypeAliasDeclaration(node as ts.TypeAliasDeclaration);
            case ts.SyntaxKind.InterfaceDeclaration:
                return this.target.transpileInterfaceDeclaration(node as ts.InterfaceDeclaration);
            case ts.SyntaxKind.EndOfFileToken:
                return this.target.transpileEndOfFileToken(node as ts.EndOfFileToken);
            case ts.SyntaxKind.BinaryExpression:
                return this.target.transpileBinaryExpression(node as ts.BinaryExpression);
            case ts.SyntaxKind.ConditionalExpression:
                return this.target.transpileConditionalExpression(node as ts.ConditionalExpression);
            case ts.SyntaxKind.CallExpression:
                return this.target.transpileCallExpression(node as ts.CallExpression);
            case ts.SyntaxKind.PropertyAccessExpression:
                return this.target.transpilePropertyAccessExpression(node as ts.PropertyAccessExpression);
            case ts.SyntaxKind.ElementAccessExpression:
                return this.target.transpileElementAccessExpression(node as ts.ElementAccessExpression);
            case ts.SyntaxKind.Identifier:
                return this.target.transpileIdentifier(node as ts.Identifier);
            case ts.SyntaxKind.ArrayBindingPattern:
                return this.target.transpileArrayBindingPattern(node as ts.ArrayBindingPattern);
            case ts.SyntaxKind.ObjectBindingPattern:
                return this.target.transpileObjectBindingPattern(node as ts.ObjectBindingPattern);
            case ts.SyntaxKind.StringLiteral:
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
                return this.target.transpileStringLiteral(node as ts.StringLiteral);
            case ts.SyntaxKind.TemplateExpression:
                return this.target.transpileTemplateExpression(node as ts.TemplateExpression);
            case ts.SyntaxKind.NumericLiteral:
                return this.target.transpileNumericLiteral(node as ts.NumericLiteral);
            case ts.SyntaxKind.TrueKeyword:
            case ts.SyntaxKind.FalseKeyword:
            case ts.SyntaxKind.NullKeyword:
            case ts.SyntaxKind.UndefinedKeyword:
            case ts.SyntaxKind.ThisKeyword:
            case ts.SyntaxKind.SuperKeyword:
                return this.target.transpileKeyword(node as any);
            case ts.SyntaxKind.PostfixUnaryExpression:
                return this.target.transpilePostfixUnaryExpression(node as ts.PostfixUnaryExpression);
            case ts.SyntaxKind.PrefixUnaryExpression:
                return this.target.transpilePrefixUnaryExpression(node as ts.PrefixUnaryExpression);
            case ts.SyntaxKind.ArrayLiteralExpression:
                return this.target.transpileArrayLiteralExpression(node as ts.ArrayLiteralExpression);
            case ts.SyntaxKind.ObjectLiteralExpression:
                return this.target.transpileObjectLiteralExpression(node as ts.ObjectLiteralExpression);
            case ts.SyntaxKind.DeleteExpression:
                return this.target.transpileDeleteExpression(node as ts.DeleteExpression);
            case ts.SyntaxKind.FunctionExpression:
            case ts.SyntaxKind.ArrowFunction:
                return this.target.transpileFunctionExpression(node as ts.FunctionExpression);
            case ts.SyntaxKind.NewExpression:
                return this.target.transpileNewExpression(node as ts.NewExpression);
            case ts.SyntaxKind.ComputedPropertyName:
                return this.target.transpileComputedPropertyName(node as ts.ComputedPropertyName);
            case ts.SyntaxKind.ParenthesizedExpression:
                return this.target.transpileParenthesizedExpression(node as ts.ParenthesizedExpression);
            case ts.SyntaxKind.TypeAssertionExpression:
                return this.target.transpileTypeAssertion(node as ts.TypeAssertion);
            case ts.SyntaxKind.AsExpression:
                return this.target.transpileAsExpression(node as ts.AsExpression);
            case ts.SyntaxKind.TypeOfExpression:
                return this.target.transpileTypeOfExpression(node as ts.TypeOfExpression);
            case ts.SyntaxKind.EmptyStatement:
                return this.target.transpileEmptyStatement(node as ts.EmptyStatement);
            case ts.SyntaxKind.ExportAssignment:
                return this.target.transpileExportAssignment(node as ts.ExportAssignment);
            case ts.SyntaxKind.ExportDeclaration:
                return this.target.transpileExportDeclaration(node as ts.ExportDeclaration);
            case ts.SyntaxKind.ImportEqualsDeclaration:
                return this.target.transpileImportEqualsDeclaration(node as ts.ImportEqualsDeclaration);
            case ts.SyntaxKind.SpreadElement:
                return this.target.transpileSpreadElement(node as ts.SpreadElement);
            default:
                throw new UnsupportedError(`Unsupported expression: ${ts.SyntaxKind[node.kind]}`, node);
        }
    }
}
