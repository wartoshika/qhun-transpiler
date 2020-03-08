import { PartialTranspiler } from "./impl/PartialTranspiler";
import { ClassExpression, BinaryExpression, ConditionalExpression, CallExpression, PropertyAccessExpression, ElementAccessExpression, TemplateExpression, PostfixUnaryExpression, PrefixUnaryExpression, ObjectLiteralExpression, ArrayLiteralExpression, DeleteExpression, FunctionExpression, ArrowFunction, NewExpression, ParenthesizedExpression, AsExpression, TypeOfExpression, RegularExpressionLiteral, TaggedTemplateExpression } from "typescript";

export interface ExpressionTranspiler extends PartialTranspiler {

    /**
     * transpiles a class expression
     * @param node the node to transpile
     */
    classExpression(node: ClassExpression): string;

    /**
     * transpiles a binary expression
     * @param node the node to transpile
     */
    binaryExpression(node: BinaryExpression): string;

    /**
     * transpiles a conditional expression
     * @param node the node to transpile
     */
    conditionalExpression(node: ConditionalExpression): string;

    /**
     * transpiles a call expression
     * @param node the node to transpile
     */
    callExpression(node: CallExpression): string;

    /**
     * transpiles a property access expression
     * @param node the node to transpile
     */
    propertyAccessExpression(node: PropertyAccessExpression): string;

    /**
     * transpiles an element access expression
     * @param node the node to transpile
     */
    elementAccessExpression(node: ElementAccessExpression): string;

    /**
     * transpiles a template expression
     * @param node the node to transpile
     */
    templateExpression(node: TemplateExpression): string;

    /**
     * transpiles a postfix unary expression
     * @param node the node to transpile
     */
    postfixUnaryExpression(node: PostfixUnaryExpression): string;

    /**
     * transpiles a prefix unary expression
     * @param node the node to transpile
     */
    prefixUnaryExpression(node: PrefixUnaryExpression): string;

    /**
     * transpiles a object literal expression
     * @param node the node to transpile
     */
    objectLiteralExpression(node: ObjectLiteralExpression): string;

    /**
     * transpiles an array literal expression
     * @param node the node to transpile
     */
    arrayLiteralExpression(node: ArrayLiteralExpression): string;

    /**
     * transpiles a delete expression
     * @param node the node to transpile
     */
    deleteExpression(node: DeleteExpression): string;

    /**
     * transpiles a function expression
     * @param node the node to transpile
     */
    functionExpression(node: FunctionExpression | ArrowFunction): string;

    /**
     * transpiles a new expression
     * @param node the node to transpile
     */
    newExpression(node: NewExpression): string;

    /**
     * transpiles a parenthesized expression
     * @param node the node to transpile
     */
    parenthesizedExpression(node: ParenthesizedExpression): string;

    /**
     * transpiles an as expression
     * @param node the node to transpile
     */
    asExpression(node: AsExpression): string;

    /**
     * transpiles a typeof expression
     * @param node the node to transpile
     */
    typeOfExpression(node: TypeOfExpression): string;

    /**
     * transpiles a regular expression litereal
     * @param node the node to transpile
     */
    regularExpressionLiteral(node: RegularExpressionLiteral): string;

    /**
     * transpiles a tagged template expression
     * @param node the node to transpile
     */
    taggedTemplateExpression(node: TaggedTemplateExpression): string;
}