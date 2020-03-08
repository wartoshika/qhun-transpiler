import { AbstractExpressionTranspiler } from "../../../transpiler/impl/AbstractExpressionTranspiler";
import { Lua51ClassExpression } from "./Lua51ClassExpression";
import { Lua51BinaryExpression } from "./Lua51BinaryExpression";
import { Lua51ConditionalExpression } from "./Lua51ConditionalExpression";
import { Lua51CallExpression } from "./Lua51CallExpression";
import { Lua51PropertyAccessExpression } from "./Lua51PropertyAccessExpression";
import { Lua51ElementAccessExpression } from "./Lua51ElementAccessExpression";
import { Lua51TemplateExpression } from "./Lua51TemplateExpression";
import { Lua51PostfixUnaryExpression } from "./Lua51PostfixUnaryExpression";
import { Lua51PrefixUnaryExpression } from "./Lua51PrefixUnaryExpression";
import { Lua51ObjectLiteralExpression } from "./Lua51ObjectLiteralExpression";
import { Lua51ArrayLiteralExpression } from "./Lua51ArrayLiteralExpression";
import { Lua51DeleteExpression } from "./Lua51DeleteExpression";
import { Lua51FunctionExpression } from "./Lua51FunctionExpression";
import { Lua51NewExpression } from "./Lua51NewExpression";
import { Lua51ParenthesizedExpression } from "./Lua51ParenthesizedExpression";
import { Lua51AsExpression } from "./Lua51AsExpression";
import { Lua51TypeOfExpression } from "./Lua51TypeOfExpression";
import { Lua51RegularExpressionLiteral } from "./Lua51RegularExpressionLiteral";
import { Lua51TaggedTemplateExpression } from "./Lua51TaggedTemplateExpression";

export class Lua51ExpressionTranspiler extends AbstractExpressionTranspiler {

    protected transpilerFunctions = {
        classExpression: Lua51ClassExpression,
        binaryExpression: Lua51BinaryExpression,
        conditionalExpression: Lua51ConditionalExpression,
        callExpression: Lua51CallExpression,
        propertyAccessExpression: Lua51PropertyAccessExpression,
        elementAccessExpression: Lua51ElementAccessExpression,
        templateExpression: Lua51TemplateExpression,
        postfixUnaryExpression: Lua51PostfixUnaryExpression,
        prefixUnaryExpression: Lua51PrefixUnaryExpression,
        objectLiteralExpression: Lua51ObjectLiteralExpression,
        arrayLiteralExpression: Lua51ArrayLiteralExpression,
        deleteExpression: Lua51DeleteExpression,
        functionExpression: Lua51FunctionExpression,
        newExpression: Lua51NewExpression,
        parenthesizedExpression: Lua51ParenthesizedExpression,
        asExpression: Lua51AsExpression,
        typeOfExpression: Lua51TypeOfExpression,
        regularExpressionLiteral: Lua51RegularExpressionLiteral,
        taggedTemplateExpression: Lua51TaggedTemplateExpression
    };
}