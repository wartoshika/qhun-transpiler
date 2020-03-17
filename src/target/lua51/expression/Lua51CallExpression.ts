import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { CallExpression, isPropertyAccessExpression, SyntaxKind, createSuper, createNodeArray, createNode, Expression, PropertyAccessExpression, ParameterDeclaration } from "typescript";
import { Lua51Keywords } from "../Lua51Keywords";
import { Lua51SpecialArrayFunction } from "./specialExpressions/Lua51SpecialArrayFunction";
import { Lua51SpecialStringFunction } from "./specialExpressions/Lua51SpecialStringFunction";

export class Lua51CallExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    private readonly CLASS_INIT_FUNCTION_NAME = this.transpiler.getConfig().obscurify ? Lua51Keywords.CLASS_INIT_FUNCTION_NAME_OBSCURIFY : Lua51Keywords.CLASS_INIT_FUNCTION_NAME;

    private arrayFunction = new Lua51SpecialArrayFunction(this.transpiler);
    private stringFunction = new Lua51SpecialStringFunction(this.transpiler);

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

        // check the generic toString(...) function
        if (functionName === "toString") {
            return this.stringFunction.handle(functionName, node);
        }

        const baseType = this.transpiler.typeHelper().getInferedType(owner);
        switch (baseType) {
            case "string":
                return this.stringFunction.handle(functionName, node);
        }

        /*
        // check if there are some special objects
        switch (ownerNameCheck) {
            /*case "Object":
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
                return this.transpileArrayFunction(node, functionName);

            case "Math":
                return this.transpileSpecialMathFunction(functionName, ownerName, node.arguments);
            
            default:
                throw new UnsupportedNodeException(`Directly calling ${functionName} on array type ${ownerName} is not supported!`, node);
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

    private transpileArrayFunction(node: CallExpression, functionName: string): string {

        return "@todo transpileArrayFunction";
    }
}