import * as ts from "typescript";

/**
 * a transpiler target
 */
export interface Target {

    /**
     * set the node transpiler function
     * @param func the node transpiler function
     */
    setNodeTranspiler(func: (node: ts.Node) => string): void;

    /**
     * get the node transpiler function
     */
    getNodeTranspiler(): (node: ts.Node) => string;

    /**
     * a function that is called before the transpiling process begins
     */
    preTranspile(): string | void;

    /**
     * a function that is called after the end of file token and directly after the transpiling process
     */
    postTranspile(): string | void;

    /**
     * transpiles an import declaration
     * @param node the node to transpile
     */
    transpileImportDeclaration(node: ts.ImportDeclaration): string;

    /**
     * transpiles a class declaration
     * @param node the node to transpile
     */
    transpileClassDeclaration(node: ts.ClassDeclaration): string;

    /**
     * transpiles a module declaration
     * @param node the node to transpile
     */
    transpileModuleDeclaration(node: ts.ModuleDeclaration): string;

    /**
     * transpiles a block
     * @param node the node to transpile
     */
    transpileBlock(node: ts.Block): string;

    /**
     * transpiles an enum declaration
     * @param node the node to transpile
     */
    transpileEnumDeclaration(node: ts.EnumDeclaration): string;

    /**
     * transpile a function declaration
     * @param node the node to transpile
     */
    transpileFunctionDeclaration(node: ts.FunctionDeclaration): string;

    /**
     * transpiles a variable statement
     * @param node the node to transpile
     */
    transpileVariableStatement(node: ts.VariableStatement): string;

    /**
     * transpiles a variable declaration list
     * @param node the node to transpile
     */
    transpileVariableDeclarationList(node: ts.VariableDeclarationList): string;

    /**
     * transpiles a variable declaration
     * @param node the node to transpile
     */
    transpileVariableDeclaration(node: ts.VariableDeclaration): string;

    /**
     * transpiles a return statement
     * @param node the node to transpile
     */
    transpileReturnStatement(node: ts.ReturnStatement): string;

    /**
     * transpiles an if statement
     * @param node the node to transpile
     */
    transpileIfStatement(node: ts.IfStatement): string;

    /**
     * transpiles a while statement
     * @param node the node to transpile
     */
    transpileWhileStatement(node: ts.WhileStatement): string;

    /**
     * transpiles a do statement
     * @param node the node to transpile
     */
    transpileDoStatement(node: ts.DoStatement): string;

    /**
     * transpiles a for statement
     * @param node the node to transpile
     */
    transpileForStatement(node: ts.ForStatement): string;

    /**
     * transpiles a for of statement
     * @param node the node to transpile
     */
    transpileForOfStatement(node: ts.ForOfStatement): string;

    /**
     * transpiles a for in statement
     * @param node the node to transpile
     */
    transpileForInStatement(node: ts.ForInStatement): string;

    /**
     * transpiles a switch statement
     * @param node the node to transpile
     */
    transpileSwitchStatement(node: ts.SwitchStatement): string;

    /**
     * transpiles a break statement
     * @param node the node to transpile
     */
    transpileBreakStatement(node: ts.BreakStatement): string;

    /**
     * transpiles a try statement
     * @param node the node to transpile
     */
    transpileTryStatement(node: ts.TryStatement): string;

    /**
     * transpiles a throw statement
     * @param node the node to transpile
     */
    transpileThrowStatement(node: ts.ThrowStatement): string;

    /**
     * transpiles a continue statement
     * @param node the node to transpile
     */
    transpileContinueStatement(node: ts.ContinueStatement): string;

    /**
     * transpiles a type alias declaration
     * @param node the node to transpile
     */
    transpileTypeAliasDeclaration(node: ts.TypeAliasDeclaration): string;

    /**
     * transpiles an interface declaration
     * @param node the node to transpile
     */
    transpileInterfaceDeclaration(node: ts.InterfaceDeclaration): string;

    /**
     * transpiles the end of file token
     * @param node the node to transpile
     */
    transpileEndOfFileToken(node: ts.EndOfFileToken): string;

    /**
     * transpiles a binary expression
     * @param node the node to transpile
     */
    transpileBinaryExpression(node: ts.BinaryExpression): string;

    /**
     * transpiles a conditional expression
     * @param node the node to transpile
     */
    transpileConditionalExpression(node: ts.ConditionalExpression): string;

    /**
     * transpiles a call expression
     * @param node the node to transpile
     */
    transpileCallExpression(node: ts.CallExpression): string;

    /**
     * transpiles a property access expression
     * @param node the node to transpile
     */
    transpilePropertyAccessExpression(node: ts.PropertyAccessExpression): string;

    /**
     * transpiles an element access expression
     * @param node the node to transpile
     */
    transpileElementAccessExpression(node: ts.ElementAccessExpression): string;

    /**
     * transpiles an identifer
     * @param node the node to transpile
     */
    transpileIdentifier(node: ts.Identifier): string;

    /**
     * transpiles a string literal
     * @param node the node to transpile
     */
    transpileStringLiteral(node: ts.StringLiteral): string;

    /**
     * transpiles a template expression
     * @param node the node to transpile
     */
    transpileTemplateExpression(node: ts.TemplateExpression): string;

    /**
     * transpiles a numeric literal
     * @param node the node to transpile
     */
    transpileNumericLiteral(node: ts.NumericLiteral): string;

    /**
     * transpiles a keyword
     * @param keyword the keyword to transpile
     */
    transpileKeyword(keyword: ts.Node): string;

    /**
     * transpiles a postfix unary expression
     * @param node the node to transpile
     */
    transpilePostfixUnaryExpression(node: ts.PostfixUnaryExpression): string;

    /**
     * transpiles a prefix unary expression
     * @param node the node to transpile
     */
    transpilePrefixUnaryExpression(node: ts.PrefixUnaryExpression): string;

    /**
     * transpiles a object literal expression
     * @param node the node to transpile
     */
    transpileObjectLiteralExpression(node: ts.ObjectLiteralExpression): string;

    /**
     * transpiles an array literal expression
     * @param node the node to transpile
     */
    transpileArrayLiteralExpression(node: ts.ArrayLiteralExpression): string;

    /**
     * transpiles a delete expression
     * @param node the node to transpile
     */
    transpileDeleteExpression(node: ts.DeleteExpression): string;

    /**
     * transpiles a function expression
     * @param node the node to transpile
     */
    transpileFunctionExpression(node: ts.FunctionExpression | ts.ArrowFunction): string;

    /**
     * transpiles a new expression
     * @param node the node to transpile
     */
    transpileNewExpression(node: ts.NewExpression): string;

    /**
     * transpiles a computed property name
     * @param node the node to transpile
     */
    transpileComputedPropertyName(node: ts.ComputedPropertyName): string;

    /**
     * transpiles a parenthesized expression
     * @param node the node to transpile
     */
    transpileParenthesizedExpression(node: ts.ParenthesizedExpression): string;

    /**
     * transpiles a type assertion
     * @param node the node to transpile
     */
    transpileTypeAssertion(node: ts.TypeAssertion): string;

    /**
     * transpiles an as expression
     * @param node the node to transpile
     */
    transpileAsExpression(node: ts.AsExpression): string;

    /**
     * transpiles a typeof expression
     * @param node the node to transpile
     */
    transpileTypeOfExpression(node: ts.TypeOfExpression): string;

    /**
     * transpiles an empty statement
     * @param node the node to transpile
     */
    transpileEmptyStatement(node: ts.EmptyStatement): string;

    /**
     * transpiles an export assignment
     * @param node the node to transpile
     */
    transpileExportAssignment(node: ts.ExportAssignment): string;

    /**
     * transpiles an export declaration
     * @param node the node to transpile
     */
    transpileExportDeclaration(node: ts.ExportDeclaration): string;

    /**
     * transpiles an import equals declaration
     * @param node the node to transpile
     */
    transpileImportEqualsDeclaration(node: ts.ImportEqualsDeclaration): string;
}
