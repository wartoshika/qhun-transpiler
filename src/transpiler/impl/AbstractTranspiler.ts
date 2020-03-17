import { Transpiler } from "../Transpiler";
import { ExpressionTranspiler } from "../ExpressionTranspiler";
import { DeclarationTranspiler } from "../DeclarationTranspiler";
import { DecoratorTranspiler } from "../DecoratorTranspiler";
import { StatementTranspiler } from "../StatementTranspiler";
import { MiscTranspiler } from "../MiscTranspiler";
import { NodeKindMapper, Imports } from "../../constraint";
import { SyntaxKind, Node, TypeChecker, Identifier, SourceFile, BindingName, createSourceFile, ScriptTarget } from "typescript";
import { UnsupportedNodeException } from "../../exception/UnsupportedNodeException";
import { TypeHelper } from "../../util/TypeHelper";
import { Config } from "../../Config";
import { Obscurifier } from "../../util/Obscurifier";
import { Target } from "../Target";

export abstract class AbstractTranspiler<C extends Required<Config> = Required<Config>> implements Transpiler<C> {

    protected transpilerNodeMapping: NodeKindMapper = {
        // DECLARATIONS
        [SyntaxKind.FunctionDeclaration]: () => [this.declaration(), this.declaration().functionDeclaration],
        [SyntaxKind.ImportDeclaration]: () => [this.declaration(), this.declaration().importDeclaration],
        [SyntaxKind.InterfaceDeclaration]: () => [this.declaration(), this.declaration().interfaceDeclaration],
        [SyntaxKind.TypeAliasDeclaration]: () => [this.declaration(), this.declaration().typeAliasDeclaration],
        [SyntaxKind.ExportDeclaration]: () => [this.declaration(), this.declaration().exportDeclaration],
        [SyntaxKind.ImportEqualsDeclaration]: () => [this.declaration(), this.declaration().importEqualsDeclaration],
        [SyntaxKind.ClassDeclaration]: () => [this.declaration(), this.declaration().classDeclaration],
        [SyntaxKind.ModuleDeclaration]: () => [this.declaration(), this.declaration().moduleDeclaration],
        [SyntaxKind.EnumDeclaration]: () => [this.declaration(), this.declaration().enumDeclaration],
        [SyntaxKind.VariableDeclarationList]: () => [this.declaration(), this.declaration().variableDeclarationList],
        [SyntaxKind.VariableDeclaration]: () => [this.declaration(), this.declaration().variableDeclaration],
        [SyntaxKind.MissingDeclaration]: () => [this.declaration(), this.declaration().missingDeclaration],
        // STATEMENTS
        [SyntaxKind.FirstStatement]: () => [this.statement(), this.statement().firstStatement],
        [SyntaxKind.VariableStatement]: () => [this.statement(), this.statement().variableStatement],
        [SyntaxKind.ReturnStatement]: () => [this.statement(), this.statement().returnStatement],
        [SyntaxKind.IfStatement]: () => [this.statement(), this.statement().ifStatement],
        [SyntaxKind.WhileStatement]: () => [this.statement(), this.statement().whileStatement],
        [SyntaxKind.DoStatement]: () => [this.statement(), this.statement().doStatement],
        [SyntaxKind.ForStatement]: () => [this.statement(), this.statement().forStatement],
        [SyntaxKind.ForOfStatement]: () => [this.statement(), this.statement().forOfStatement],
        [SyntaxKind.ForInStatement]: () => [this.statement(), this.statement().forInStatement],
        [SyntaxKind.SwitchStatement]: () => [this.statement(), this.statement().switchStatement],
        [SyntaxKind.BreakStatement]: () => [this.statement(), this.statement().breakStatement],
        [SyntaxKind.TryStatement]: () => [this.statement(), this.statement().tryStatement],
        [SyntaxKind.ThrowStatement]: () => [this.statement(), this.statement().throwStatement],
        [SyntaxKind.ContinueStatement]: () => [this.statement(), this.statement().continueStatement],
        [SyntaxKind.EmptyStatement]: () => [this.statement(), this.statement().emptyStatement],
        [SyntaxKind.ExpressionStatement]: () => [this.statement(), this.statement().expressionStatement],
        // EXPRESSIONS
        [SyntaxKind.ClassExpression]: () => [this.expression(), this.expression().classExpression],
        [SyntaxKind.BinaryExpression]: () => [this.expression(), this.expression().binaryExpression],
        [SyntaxKind.ConditionalExpression]: () => [this.expression(), this.expression().conditionalExpression],
        [SyntaxKind.CallExpression]: () => [this.expression(), this.expression().callExpression],
        [SyntaxKind.PropertyAccessExpression]: () => [this.expression(), this.expression().propertyAccessExpression],
        [SyntaxKind.ElementAccessExpression]: () => [this.expression(), this.expression().elementAccessExpression],
        [SyntaxKind.TemplateExpression]: () => [this.expression(), this.expression().templateExpression],
        [SyntaxKind.PostfixUnaryExpression]: () => [this.expression(), this.expression().postfixUnaryExpression],
        [SyntaxKind.PrefixUnaryExpression]: () => [this.expression(), this.expression().prefixUnaryExpression],
        [SyntaxKind.ObjectLiteralExpression]: () => [this.expression(), this.expression().objectLiteralExpression],
        [SyntaxKind.ArrayLiteralExpression]: () => [this.expression(), this.expression().arrayLiteralExpression],
        [SyntaxKind.DeleteExpression]: () => [this.expression(), this.expression().deleteExpression],
        [SyntaxKind.FunctionExpression]: () => [this.expression(), this.expression().functionExpression],
        [SyntaxKind.ArrowFunction]: () => [this.expression(), this.expression().functionExpression],
        [SyntaxKind.NewExpression]: () => [this.expression(), this.expression().newExpression],
        [SyntaxKind.ParenthesizedExpression]: () => [this.expression(), this.expression().parenthesizedExpression],
        [SyntaxKind.AsExpression]: () => [this.expression(), this.expression().asExpression],
        [SyntaxKind.TypeOfExpression]: () => [this.expression(), this.expression().typeOfExpression],
        [SyntaxKind.RegularExpressionLiteral]: () => [this.expression(), this.expression().regularExpressionLiteral],
        [SyntaxKind.TaggedTemplateExpression]: () => [this.expression(), this.expression().taggedTemplateExpression],
        // MISC
        [SyntaxKind.Identifier]: () => [this.misc(), this.misc().identifier],
        [SyntaxKind.Block]: () => [this.misc(), this.misc().block],
        [SyntaxKind.StringLiteral]: () => [this.misc(), this.misc().stringLiteral],
        [SyntaxKind.FirstLiteralToken]: () => [this.misc(), this.misc().firstLiteralToken],
        [SyntaxKind.TrueKeyword]: () => [this.misc(), this.misc().keyword],
        [SyntaxKind.FalseKeyword]: () => [this.misc(), this.misc().keyword],
        [SyntaxKind.NullKeyword]: () => [this.misc(), this.misc().keyword],
        [SyntaxKind.UndefinedKeyword]: () => [this.misc(), this.misc().keyword],
        [SyntaxKind.ThisKeyword]: () => [this.misc(), this.misc().keyword],
        [SyntaxKind.SuperKeyword]: () => [this.misc(), this.misc().keyword],
        [SyntaxKind.ArrayBindingPattern]: () => [this.misc(), this.misc().arrayBindingPattern],

    };

    protected abstract subTranspilers: {
        expression: ExpressionTranspiler,
        declaration: DeclarationTranspiler,
        decorator: DecoratorTranspiler,
        statement: StatementTranspiler,
        misc: MiscTranspiler
    };

    constructor(
        protected typeChecker: TypeChecker,
        protected config: Required<C>,
        protected obscurifier: Obscurifier
    ) { }

    protected variableNames: string[] = [];
    protected exportVariables: string[] = [];
    protected imports: Imports[] = [];
    protected classes: string[] = [];
    protected target: Target | undefined;
    private _typeHelper = new TypeHelper(this.typeChecker, this);
    private currentSourceFile!: SourceFile;

    /**
     * @inheritdoc
     */
    public expression(): ExpressionTranspiler {
        return this.subTranspilers.expression;
    }

    /**
     * @inheritdoc
     */
    public declaration(): DeclarationTranspiler {
        return this.subTranspilers.declaration;
    }

    /**
     * @inheritdoc
     */
    public decorator(): DecoratorTranspiler {
        return this.subTranspilers.decorator
    }

    /**
     * @inheritdoc
     */
    public statement(): StatementTranspiler {
        return this.subTranspilers.statement;
    }

    /**
     * @inheritdoc
     */
    public misc(): MiscTranspiler {
        return this.subTranspilers.misc;
    }

    /**
     * @inheritdoc
     */
    public typeHelper(): TypeHelper {
        return this._typeHelper;
    }

    /**
     * @inheritdoc
     */
    public transpileNode(node: Node, originalNode?: Node): string {

        const nodeTranspiler = this.transpilerNodeMapping[node.kind];
        if (typeof nodeTranspiler === "function") {
            const [context, executable] = nodeTranspiler();
            let res = executable.bind(context)(node);
            if (res.length === 0) {
                console.warn("Node has no content: ", SyntaxKind[node.kind]);
            }
            return res;
        } else {
            throw new UnsupportedNodeException(`The current node type ${SyntaxKind[node.kind]}(${node.kind}) is not supported in the current target.`, node, originalNode);
        }
    }

    /**
     * @inheritdoc
     */
    public transpileCode(code: string, onError?: (error: Error) => string): string {

        if (!this.target) {
            throw new Error("Target has not been set within the transpiler class. Invalid program state! Please report an issue and explain what you have done.");
        }

        // create an inline source file to transpile the given code and reuse everything
        try {
            return this.target.transpileSourceFile(createSourceFile("inlineCode", code, ScriptTarget.Latest));
        } catch (e) {
            if (typeof onError === "function") {
                return onError(e);
            }
            throw e;
        }
    }

    /**
     * @inheritdoc
     */
    public registerVariables(...variables: string[]): ThisType<Transpiler> {
        this.variableNames.push(...variables);
        return this;
    }

    /**
     * @inheritdoc
     */
    public registerExport(...exportVariables: string[]): ThisType<Transpiler> {
        this.exportVariables.push(...exportVariables);
        return this;
    }

    /**
     * @inheritdoc
     */
    public registerImport(...imports: Imports[]): ThisType<Transpiler> {
        this.imports.push(...imports);
        return this;
    }

    /**
     * @inheritdoc
     */
    public registerClass(...classNames: string[]): ThisType<Transpiler> {
        this.classes.push(...classNames);
        return this;
    }

    /**
     * @inheritdoc
     */
    public getIdentifierName(identifier: Identifier | BindingName | string): string {

        let originalName: string;

        if (typeof identifier === "string") {
            originalName = identifier;
        } else {
            originalName = this.transpileNode(identifier);
        }

        if (!this.config.obscurify) {
            return originalName;
        }

        return this.obscurifier.getObscurified(originalName, this.currentSourceFile.fileName);
    }

    /**
     * @inheritdoc
     */
    public getConfig(): C {
        return this.config;
    }

    /**
     * @inheritdoc
     */
    public getRegisteredClasses(): string[] {
        return this.classes;
    }

    /**
     * @inheritdoc
     */
    public setSourceFile(sourceFile: SourceFile): void {
        this.currentSourceFile = sourceFile;
    }

    public setTarget(target: Target): void {
        this.target = target;
    }

    /**
     * @inheritdoc
     */
    public space(amount?: number): string {
        if (this.config.prettyPrint) {
            return " ".repeat(amount || 1);
        }
        return "";
    }

    /**
     * @inheritdoc
     */
    public break(): string {

        return this.config.prettyPrint ? "\n" : " ";
    }

    /**
     * @inheritdoc
     */
    public breakNoSpace(): string {

        return this.config.prettyPrint ? "\n" : "";
    }

    /**
     * @inheritdoc
     */
    public addIntend(code: string, times: number = 1): string {

        if (!this.config.prettyPrint) {
            return code;
        }

        const spaces = this.config.intend > 0 ? " ".repeat(this.config.intend * times) : "";
        return code.split("\n")
            .map(line => spaces + line)
            .join("\n");
    }

    /**
     * @inheritdoc
     */
    public typeOfNode(node: Node): string {
        return this.typeHelper().typeOfNode(node);
    }
}