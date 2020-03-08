import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { CallExpression, isPropertyAccessExpression, SyntaxKind, createSuper, createNodeArray, createNode, Expression, PropertyAccessExpression, ParameterDeclaration } from "typescript";
import { Lua51Keywords } from "../Lua51Keywords";

export class Lua51CallExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    private readonly CLASS_INIT_FUNCTION_NAME = this.transpiler.getConfig().obscurify ? Lua51Keywords.CLASS_INIT_FUNCTION_NAME_OBSCURIFY : Lua51Keywords.CLASS_INIT_FUNCTION_NAME;

    /**
     * @inheritdoc
     */
    public callExpression(node: CallExpression): string {

        // check if the call expression is from an access expression
        if (isPropertyAccessExpression(node.expression)) {
            return this.transpileCallExpressionOnProperty(node);
        }

        // check for super function calls
        let base: string;
        if (node.expression.kind === SyntaxKind.SuperKeyword) {

            // use the constructor of the super class
            base = `${this.transpiler.transpileNode(createSuper())}.${this.CLASS_INIT_FUNCTION_NAME}`;

            // add the self reference to the arguments
            node.arguments = createNodeArray([createNode(SyntaxKind.ThisKeyword) as Expression, ...node.arguments]);
        } else {

            // normal funcion call.
            base = this.transpiler.transpileNode(node.expression);

            /*  @todo: transpile global functions
            // global special function?
             if (GLOBAL_SPECIAL_FUNCTIONS.indexOf(base) >= 0) {
                 return this.transpileSpecialGlobalFunction(node, base);
             }
             */

            /* @todo: transpile preprocessor functions
            // check for preprocessor function
            if (Object.keys(PreProcessorFunction).indexOf(base) >= 0) {
                return this.transpilePreprocessorCallExpression(node, base);
            }
            */
        }

        // transpile params
        const params = node.arguments.map(n => this.transpiler.transpileNode(n, node));

        // put everything together
        return `${base}(${this.transpiler.space()}${params.join(`,${this.transpiler.space()}`)}${params.length > 0 ? this.transpiler.space() : ""})`;
    }

    /**
     * transpiles a call expression from a property access expression
     * @param node the node to transpile
     */
    private transpileCallExpressionOnProperty(node: CallExpression): string {

        // get the called function name
        const functionObj = node.expression as PropertyAccessExpression;
        const functionName = this.transpiler.transpileNode(functionObj.name);

        // check if the function call comes from an known object that
        // supports special functions
        const owner = (node.expression as PropertyAccessExpression).expression;
        const ownerName = this.transpiler.transpileNode(owner);
        let ownerNameCheck = this.transpiler.transpileNode(owner);

        /* @todo: special toString function
        // check the generic toString(...) function
        if (functionName === "toString") {
            return this.transpileSpecialToStringFunction(ownerName, node.arguments);
        }*/

        /* @todo: special functions
        // preperation for calls like "test".replace() or [1,2].map()
        if (Types.isString(owner, this.typeChecker)) {
            ownerNameCheck = "String";
        } else if (Types.isArray(owner, this.typeChecker, true)) {
            ownerNameCheck = "Array";
        } else if (Types.isFunction(owner, this.typeChecker)) {
            ownerNameCheck = "Function";
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
                    // throw an exception here. check the bubble boolean to decide if this exception must
                    // be forwarded
                    if (e instanceof UnsupportedError && e.bubble) {
                        throw e;
                    }
                }
                break;
            case "Function":
                return this.transpileSpecialFunctionFunction(functionName, ownerName, node.arguments);
            case "String":
                return this.transpileSpecialStringFunction(functionName, ownerName, node.arguments);
            case "Array":
                return this.transpileSpecialArrayFunction(functionName, ownerName, node.arguments);
            case "Math":
                return this.transpileSpecialMathFunction(functionName, ownerName, node.arguments);
        }*/

        // transpile params
        const params = node.arguments.map(n => this.transpiler.transpileNode(n, node));

        // check this param
        const hasThisParam = this.doesMethodDeclarationHasThisParam(node);

        // use the default access pattern
        return `${ownerName}${hasThisParam ? "." : ":"}${functionName}(${this.transpiler.space()}${params.join(`,${this.transpiler.space()}`)}${params.length > 0 ? this.transpiler.space() : ""})`;
    }

    /**
     * check if the method declaration requires a this param
     * @param node the call expression to check
     */
    private doesMethodDeclarationHasThisParam(node: CallExpression): boolean {

        let hasThisParam: boolean = false;
        try {
            const methodSignature = this.transpiler.typeHelper().getTypeChecker().getResolvedSignature(node);
            if (methodSignature) {
                methodSignature.getDeclaration().parameters
                    .filter(param => !!(param.type))
                    .forEach(param => {
                        const originalKeyworkKind: SyntaxKind = ((param.type!.parent as ParameterDeclaration).name as any).originalKeywordKind;
                        if (originalKeyworkKind === SyntaxKind.ThisKeyword) {
                            hasThisParam = true;
                        }
                    });
            }
        } catch (e) {
            // noop
        }

        return hasThisParam;
    }
}