import { PartialTranspiler } from "./PartialTranspiler";
import { Node, ClassExpression, BinaryExpression, ConditionalExpression, CallExpression, PropertyAccessExpression, ElementAccessExpression, TemplateExpression, PostfixUnaryExpression, PrefixUnaryExpression, ObjectLiteralExpression, ArrayLiteralExpression, DeleteExpression, FunctionExpression, ArrowFunction, NewExpression, ParenthesizedExpression, AsExpression, TypeOfExpression, RegularExpressionLiteral, TaggedTemplateExpression } from "typescript";
import { PartialTranspilerConstructor } from "../../constraint";
import { ExpressionTranspiler } from "../ExpressionTranspiler";

declare type Expressions = {
    [P in keyof AbstractExpressionTranspiler]: AbstractExpressionTranspiler[P] extends (node: Node) => string ? PartialTranspilerConstructor<ExpressionTranspiler, P> : never;
}

export abstract class AbstractExpressionTranspiler extends PartialTranspiler implements ExpressionTranspiler {

    protected abstract transpilerFunctions: Expressions;

    private classStorage: {
        [P in keyof Expressions]?: any
    } = {};

    /**
     * @inheritdoc
     */
    public classExpression(node: ClassExpression): string {
        return this.constructClass("classExpression").classExpression(node);
    }

    /**
     * @inheritdoc
     */
    public binaryExpression(node: BinaryExpression): string {
        return this.constructClass("binaryExpression").binaryExpression(node);
    }

    /**
     * @inheritdoc
     */
    public conditionalExpression(node: ConditionalExpression): string {
        return this.constructClass("conditionalExpression").conditionalExpression(node);
    }

    /**
     * @inheritdoc
     */
    public callExpression(node: CallExpression): string {
        return this.constructClass("callExpression").callExpression(node);
    }

    /**
     * @inheritdoc
     */
    public propertyAccessExpression(node: PropertyAccessExpression): string {
        return this.constructClass("propertyAccessExpression").propertyAccessExpression(node);
    }

    /**
     * @inheritdoc
     */
    public elementAccessExpression(node: ElementAccessExpression): string {
        return this.constructClass("elementAccessExpression").elementAccessExpression(node);
    }

    /**
     * @inheritdoc
     */
    public templateExpression(node: TemplateExpression): string {
        return this.constructClass("templateExpression").templateExpression(node);
    }

    /**
     * @inheritdoc
     */
    public postfixUnaryExpression(node: PostfixUnaryExpression): string {
        return this.constructClass("postfixUnaryExpression").postfixUnaryExpression(node);
    }

    /**
     * @inheritdoc
     */
    public prefixUnaryExpression(node: PrefixUnaryExpression): string {
        return this.constructClass("prefixUnaryExpression").prefixUnaryExpression(node);
    }

    /**
     * @inheritdoc
     */
    public objectLiteralExpression(node: ObjectLiteralExpression): string {
        return this.constructClass("objectLiteralExpression").objectLiteralExpression(node);
    }

    /**
     * @inheritdoc
     */
    public arrayLiteralExpression(node: ArrayLiteralExpression): string {
        return this.constructClass("arrayLiteralExpression").arrayLiteralExpression(node);
    }

    /**
     * @inheritdoc
     */
    public deleteExpression(node: DeleteExpression): string {
        return this.constructClass("deleteExpression").deleteExpression(node);
    }

    /**
     * @inheritdoc
     */
    public functionExpression(node: FunctionExpression | ArrowFunction): string {
        return this.constructClass("functionExpression").functionExpression(node);
    }

    /**
     * @inheritdoc
     */
    public newExpression(node: NewExpression): string {
        return this.constructClass("newExpression").newExpression(node);
    }

    /**
     * @inheritdoc
     */
    public parenthesizedExpression(node: ParenthesizedExpression): string {
        return this.constructClass("parenthesizedExpression").parenthesizedExpression(node);
    }

    /**
     * @inheritdoc
     */
    public asExpression(node: AsExpression): string {
        return this.constructClass("asExpression").asExpression(node);
    }

    /**
     * @inheritdoc
     */
    public typeOfExpression(node: TypeOfExpression): string {
        return this.constructClass("typeOfExpression").typeOfExpression(node);
    }

    /**
     * @inheritdoc
     */
    public regularExpressionLiteral(node: RegularExpressionLiteral): string {
        return this.constructClass("regularExpressionLiteral").regularExpressionLiteral(node);
    }

    /**
     * @inheritdoc
     */
    public taggedTemplateExpression(node: TaggedTemplateExpression): string {
        return this.constructClass("taggedTemplateExpression").taggedTemplateExpression(node);
    }

    /**
     * constructs the given class and store the result. return from the cache if already constructed
     * @param transpilerClass 
     */
    private constructClass<A extends keyof Expressions>(part: A): InstanceType<Expressions[A]> {

        if (this.classStorage[part] === undefined) {
            this.classStorage[part] = new this.transpilerFunctions[part](this.transpiler);
        }
        return this.classStorage[part];
    }
}