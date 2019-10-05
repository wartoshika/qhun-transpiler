import { LuaBinaryExpression } from "./LuaBinaryExpression";
import { LuaConditionalExpression } from "./LuaConditionalExpression";
import { LuaCallExpression } from "./LuaCallExpression";
import { LuaPropertyAccessExpression } from "./LuaPropertyAccessExpression";
import { LuaElementAccessExpression } from "./LuaElementAccessExpression";
import { LuaTemplateExpression } from "./LuaTemplateExpression";
import { LuaPostfixUnaryExpression } from "./LuaPostfixUnaryExpression";
import { LuaPrefixUnaryExpression } from "./LuaPrefixUnaryExpression";
import { LuaObjectLiteralExpression } from "./LuaObjectLiteralExpression";
import { LuaArrayLiteralExpression } from "./LuaArrayLiteralExpression";
import { LuaDeleteExpression } from "./LuaDeleteExpression";
import { LuaFunctionExpression } from "./LuaFunctionExpression";
import { LuaNewExpression } from "./LuaNewExpression";
import { LuaParenthesizedExpression } from "./LuaParenthesizedExpression";
import { LuaAsExpression } from "./LuaAsExpression";
import { LuaTypeOfExpression } from "./LuaTypeOfExpression";
import { LuaClassExpression } from "./LuaClassExpression";
import { LuaTaggedTemplateExpression } from "./LuaTaggedTemplateExpression";

export interface LuaExpressions extends LuaBinaryExpression, LuaConditionalExpression, LuaCallExpression, LuaPropertyAccessExpression,
    LuaElementAccessExpression, LuaTemplateExpression, LuaPostfixUnaryExpression, LuaPrefixUnaryExpression, LuaObjectLiteralExpression,
    LuaArrayLiteralExpression, LuaDeleteExpression, LuaFunctionExpression, LuaNewExpression, LuaParenthesizedExpression, LuaAsExpression,
    LuaTypeOfExpression, LuaClassExpression, LuaTaggedTemplateExpression { }
