import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";
import { LuaArraySpecial, LuaObjectSpecial, LuaStringSpecial, LuaMathSpecial } from "../special";
import { Types } from "../../../transpiler/Types";
import { LuaKeywords } from "../LuaKeywords";

export interface LuaCallExpression extends BaseTarget, Target, LuaArraySpecial, LuaObjectSpecial, LuaStringSpecial, LuaMathSpecial { }
export class LuaCallExpression implements Partial<Target> {

    public transpileCallExpression(node: ts.CallExpression): string {

        // check if the call expression is from an access expression
        if (ts.isPropertyAccessExpression(node.expression)) {
            return this.transpileCallExpressionOnProperty(node);
        }

        // check for super function calls
        let base: string;
        if (node.expression.kind === ts.SyntaxKind.SuperKeyword) {

            // use the constructor of the super class
            base = `${this.transpileNode(ts.createSuper())}.${LuaKeywords.CLASS_INIT_FUNCTION_NAME}`;

            // add the self reference to the arguments
            node.arguments = ts.createNodeArray([ts.createNode(ts.SyntaxKind.ThisKeyword) as ts.Expression, ...node.arguments]);
        } else {

            // normal funcion call.
            base = this.transpileNode(node.expression);
        }

        // transpile params
        const params = node.arguments.map(this.transpileNode);

        // put everything together
        return `${base}(${params.join(", ")})`;
    }

    /**
     * transpiles a call expression from a property access expression
     * @param node the node to transpile
     */
    private transpileCallExpressionOnProperty(node: ts.CallExpression): string {

        // get the called function name
        const functionObj = node.expression as ts.PropertyAccessExpression;
        const functionName = this.transpileNode(functionObj.name);

        // check if the function call comes from an known object that
        // supports special functions
        const owner = (node.expression as ts.PropertyAccessExpression).expression;
        const ownerName = this.transpileNode(owner);
        let ownerNameCheck = this.transpileNode(owner);

        // preperation for calls like "test".replace() or [1,2].map()
        if (Types.isString(owner, this.typeChecker)) {
            ownerNameCheck = "String";
        } else if (Types.isArray(owner, this.typeChecker)) {
            ownerNameCheck = "Array";
        } else if (Types.isObject(owner, this.typeChecker)) {

            // be sure to exclude object type special implementations
            if ([
                "Math"
            ].indexOf(ownerName) === -1) {
                ownerNameCheck = "Object";
            }
        }

        // check if there are some special objects
        switch (ownerNameCheck) {
            case "Object":
                try {
                    return this.transpileSpecialObjectFunction(functionName, ownerName, node.arguments);
                } catch (e) {

                    // if this method does not exists on object, use the normal object call pattern
                    // because in most cases the function is declared on the object so dont
                    // throw an exception here. check the bubble boolean to devide if this exception must
                    // be forwarded
                    if (e instanceof UnsupportedError && e.bubble) {
                        throw e;
                    }
                }
                break;
            case "String":
                return this.transpileSpecialStringFunction(functionName, ownerName, node.arguments);
            case "Array":
                return this.transpileSpecialArrayFunction(functionName, ownerName, node.arguments);
            case "Math":
                return this.transpileSpecialMathFunction(functionName, ownerName, node.arguments);
        }

        // transpile params
        const params = node.arguments.map(this.transpileNode);

        // check this param
        const hasThisParam = this.doesMethodDeclarationHasThisParam(node);

        // use the default access pattern
        return `${ownerName}${hasThisParam ? "." : ":"}${functionName}(${params.join(", ")})`;
    }

    /**
     * check if the method declaration requires a this param
     * @param node the call expression to check
     */
    private doesMethodDeclarationHasThisParam(node: ts.CallExpression): boolean {

        let hasThisParam: boolean = false;
        try {
            const methodSignature = this.typeChecker.getResolvedSignature(node);
            methodSignature.getDeclaration().parameters.forEach(param => {
                const originalKeyworkKind: ts.SyntaxKind = ((param.type.parent as ts.ParameterDeclaration).name as any).originalKeywordKind;
                if (originalKeyworkKind === ts.SyntaxKind.ThisKeyword) {
                    hasThisParam = true;
                }
            });
        } catch (e) {
            // noop
        }

        return hasThisParam;
    }
}
