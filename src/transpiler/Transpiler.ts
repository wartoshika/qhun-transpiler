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
     * @param addDeclarations a flag if special declaration code should be added to the top of the file
     * @returns the transpiles source code
     */
    public transpile(sourceFile: ts.SourceFile, addDeclarations: boolean = true): string {

        // the transpiled sourcecode will be stored in result
        let result = this.target.preTranspile() || "";

        // iterate over every statement in the sourcefile
        sourceFile.statements.forEach(statement => {

            result += this.transpileNode(statement);
        });

        // add post transpile
        result += this.target.postTranspile(result) || "";

        // check the declaration flag
        if (addDeclarations) {
            result = [
                ...this.target.getDeclaration(),
                result
            ].join("\n");
        }

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

        // find transpiler sub function
        let nodeTranspiler: (node: ts.Node) => string;
        let nodeArgument: ts.Node = node;
        let boundArg: object = this.target;

        // check the node kind and decide what to do with this node kind
        switch (node.kind) {
            case ts.SyntaxKind.ImportDeclaration:
                nodeTranspiler = this.target.transpileImportDeclaration;
                break;
            case ts.SyntaxKind.ClassDeclaration:
                nodeTranspiler = this.target.transpileClassDeclaration;
                break;
            case ts.SyntaxKind.ClassExpression:
                nodeTranspiler = this.target.transpileClassExpression;
                break;
            case ts.SyntaxKind.ModuleDeclaration:
                nodeTranspiler = this.target.transpileModuleDeclaration;
                break;
            case ts.SyntaxKind.ModuleBlock:
                nodeTranspiler = this.target.transpileBlock;
                break;
            case ts.SyntaxKind.EnumDeclaration:
                nodeTranspiler = this.target.transpileEnumDeclaration;
                break;
            case ts.SyntaxKind.FunctionDeclaration:
                nodeTranspiler = this.target.transpileFunctionDeclaration;
                break;
            case ts.SyntaxKind.VariableStatement:
                nodeTranspiler = this.target.transpileVariableStatement;
                break;
            case ts.SyntaxKind.VariableDeclarationList:
                nodeTranspiler = this.target.transpileVariableDeclarationList;
                break;
            case ts.SyntaxKind.VariableDeclaration:
                nodeTranspiler = this.target.transpileVariableDeclaration;
                break;
            case ts.SyntaxKind.ExpressionStatement:
                nodeTranspiler = this.transpileNode;
                boundArg = this;
                nodeArgument = (node as ts.ExpressionStatement).expression;
                break;
            case ts.SyntaxKind.ReturnStatement:
                nodeTranspiler = this.target.transpileReturnStatement;
                break;
            case ts.SyntaxKind.Block:
                nodeTranspiler = this.target.transpileBlock;
                break;
            case ts.SyntaxKind.IfStatement:
                nodeTranspiler = this.target.transpileIfStatement;
                break;
            case ts.SyntaxKind.WhileStatement:
                nodeTranspiler = this.target.transpileWhileStatement;
                break;
            case ts.SyntaxKind.DoStatement:
                nodeTranspiler = this.target.transpileDoStatement;
                break;
            case ts.SyntaxKind.ForStatement:
                nodeTranspiler = this.target.transpileForStatement;
                break;
            case ts.SyntaxKind.ForOfStatement:
                nodeTranspiler = this.target.transpileForOfStatement;
                break;
            case ts.SyntaxKind.ForInStatement:
                nodeTranspiler = this.target.transpileForInStatement;
                break;
            case ts.SyntaxKind.SwitchStatement:
                nodeTranspiler = this.target.transpileSwitchStatement;
                break;
            case ts.SyntaxKind.BreakStatement:
                nodeTranspiler = this.target.transpileBreakStatement;
                break;
            case ts.SyntaxKind.TryStatement:
                nodeTranspiler = this.target.transpileTryStatement;
                break;
            case ts.SyntaxKind.ThrowStatement:
                nodeTranspiler = this.target.transpileThrowStatement;
                break;
            case ts.SyntaxKind.ContinueStatement:
                nodeTranspiler = this.target.transpileContinueStatement;
                break;
            case ts.SyntaxKind.TypeAliasDeclaration:
                nodeTranspiler = this.target.transpileTypeAliasDeclaration;
                break;
            case ts.SyntaxKind.InterfaceDeclaration:
                nodeTranspiler = this.target.transpileInterfaceDeclaration;
                break;
            case ts.SyntaxKind.EndOfFileToken:
                nodeTranspiler = this.target.transpileEndOfFileToken;
                break;
            case ts.SyntaxKind.BinaryExpression:
                nodeTranspiler = this.target.transpileBinaryExpression;
                break;
            case ts.SyntaxKind.ConditionalExpression:
                nodeTranspiler = this.target.transpileConditionalExpression;
                break;
            case ts.SyntaxKind.CallExpression:
                nodeTranspiler = this.target.transpileCallExpression;
                break;
            case ts.SyntaxKind.PropertyAccessExpression:
                nodeTranspiler = this.target.transpilePropertyAccessExpression;
                break;
            case ts.SyntaxKind.ElementAccessExpression:
                nodeTranspiler = this.target.transpileElementAccessExpression;
                break;
            case ts.SyntaxKind.Identifier:
                nodeTranspiler = this.target.transpileIdentifier;
                break;
            case ts.SyntaxKind.ArrayBindingPattern:
                nodeTranspiler = this.target.transpileArrayBindingPattern;
                break;
            case ts.SyntaxKind.ObjectBindingPattern:
                nodeTranspiler = this.target.transpileObjectBindingPattern;
                break;
            case ts.SyntaxKind.StringLiteral:
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
                nodeTranspiler = this.target.transpileStringLiteral;
                break;
            case ts.SyntaxKind.TemplateExpression:
                nodeTranspiler = this.target.transpileTemplateExpression;
                break;
            case ts.SyntaxKind.NumericLiteral:
                nodeTranspiler = this.target.transpileNumericLiteral;
                break;
            case ts.SyntaxKind.TrueKeyword:
            case ts.SyntaxKind.FalseKeyword:
            case ts.SyntaxKind.NullKeyword:
            case ts.SyntaxKind.UndefinedKeyword:
            case ts.SyntaxKind.ThisKeyword:
            case ts.SyntaxKind.SuperKeyword:
                nodeTranspiler = this.target.transpileKeyword;
                break;
            case ts.SyntaxKind.PostfixUnaryExpression:
                nodeTranspiler = this.target.transpilePostfixUnaryExpression;
                break;
            case ts.SyntaxKind.PrefixUnaryExpression:
                nodeTranspiler = this.target.transpilePrefixUnaryExpression;
                break;
            case ts.SyntaxKind.ArrayLiteralExpression:
                nodeTranspiler = this.target.transpileArrayLiteralExpression;
                break;
            case ts.SyntaxKind.ObjectLiteralExpression:
                nodeTranspiler = this.target.transpileObjectLiteralExpression;
                break;
            case ts.SyntaxKind.DeleteExpression:
                nodeTranspiler = this.target.transpileDeleteExpression;
                break;
            case ts.SyntaxKind.FunctionExpression:
            case ts.SyntaxKind.ArrowFunction:
                nodeTranspiler = this.target.transpileFunctionExpression;
                break;
            case ts.SyntaxKind.NewExpression:
                nodeTranspiler = this.target.transpileNewExpression;
                break;
            case ts.SyntaxKind.ComputedPropertyName:
                nodeTranspiler = this.target.transpileComputedPropertyName;
                break;
            case ts.SyntaxKind.ParenthesizedExpression:
                nodeTranspiler = this.target.transpileParenthesizedExpression;
                break;
            case ts.SyntaxKind.TypeAssertionExpression:
                nodeTranspiler = this.target.transpileTypeAssertion;
                break;
            case ts.SyntaxKind.AsExpression:
                nodeTranspiler = this.target.transpileAsExpression;
                break;
            case ts.SyntaxKind.TypeOfExpression:
                nodeTranspiler = this.target.transpileTypeOfExpression;
                break;
            case ts.SyntaxKind.EmptyStatement:
                nodeTranspiler = this.target.transpileEmptyStatement;
                break;
            case ts.SyntaxKind.ExportAssignment:
                nodeTranspiler = this.target.transpileExportAssignment;
                break;
            case ts.SyntaxKind.ExportDeclaration:
                nodeTranspiler = this.target.transpileExportDeclaration;
                break;
            case ts.SyntaxKind.ImportEqualsDeclaration:
                nodeTranspiler = this.target.transpileImportEqualsDeclaration;
                break;
            case ts.SyntaxKind.SpreadElement:
                nodeTranspiler = this.target.transpileSpreadElement;
                break;
            case ts.SyntaxKind.ThrowStatement:
                nodeTranspiler = this.target.transpileThrowStatement;
                break;
            case ts.SyntaxKind.RegularExpressionLiteral:
                nodeTranspiler = this.target.transpileRegularExpressionLiteral;
                break;
        }

        // overwrite available?
        const project = this.target.getProject();
        if (project.overwrite && project.overwrite[node.kind]) {

            // use the given overwrite to transpile
            return project.overwrite[node.kind](node, n => this.transpileNode(n), n => nodeTranspiler(n));
        } else if (nodeTranspiler) {

            // use found node transpiler
            return nodeTranspiler.bind(boundArg)(nodeArgument);
        } else {

            // no node transpiler found!
            throw new UnsupportedError(`Unsupported expression: ${ts.SyntaxKind[node.kind]}`, node);
        }
    }
}
