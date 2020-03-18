import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { CallExpression, isPropertyAccessExpression, SyntaxKind, createSuper, createNodeArray, createNode, Expression, PropertyAccessExpression, ParameterDeclaration } from "typescript";
import { Lua51Keywords } from "../Lua51Keywords";
import { Lua51SpecialArrayFunction } from "./specialExpressions/Lua51SpecialArrayFunction";
import { Lua51SpecialStringFunction } from "./specialExpressions/Lua51SpecialStringFunction";
import { Lua51SpecialObjectFunction } from "./specialExpressions/Lua51SpecialObjectFunction";
import { Lua51SpecialFunctionFunction } from "./specialExpressions/Lua51SpecialFunctionFunction";
import { NodeContainingException } from "../../../exception/NodeContainingException";
import { UnsupportedNodeException } from "../../../exception/UnsupportedNodeException";

export class Lua51CallExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    private readonly CLASS_INIT_FUNCTION_NAME = this.transpiler.getConfig().obscurify ? Lua51Keywords.CLASS_INIT_FUNCTION_NAME_OBSCURIFY : Lua51Keywords.CLASS_INIT_FUNCTION_NAME;

    private arrayFunction = new Lua51SpecialArrayFunction(this.transpiler);
    private stringFunction = new Lua51SpecialStringFunction(this.transpiler);
    private objectFunction = new Lua51SpecialObjectFunction(this.transpiler);
    private functionFunction = new Lua51SpecialFunctionFunction(this.transpiler);

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
        return `${base}(»${params.join(`,»`)}${params.length > 0 ? this.transpiler.space() : ""})`;
    }

    /**
     * transpiles a call expression from a property access expression
     * @param node the node to transpile
     */
    private transpileCallExpressionOnProperty(node: CallExpression): string {

        // get the called function name
        const functionObj = node.expression as PropertyAccessExpression;

        // get the name of the function
        let functionName;

        // if the function name is a reserved keyword, do not use transpileNode because
        // this meight throw a keyword exception
        if ((functionObj.name as any).escapedText) {
            functionName = (functionObj.name as any).escapedText;
        } else {
            functionName = this.transpiler.transpileNode(functionObj.name);
        }

        // check if the function call comes from an known object that
        // supports special functions
        const owner = (node.expression as PropertyAccessExpression).expression;
        const ownerName = this.transpiler.transpileNode(owner);

        // check the generic toString(...) function
        if (functionName === "toString") {
            return this.stringFunction.handle(functionName, node);
        }

        // check if the owner is a function
        if (this.transpiler.typeHelper().isFunction(owner)) {
            return this.functionFunction.handle(functionName, node);
        }

        const baseType = this.transpiler.typeHelper().getInferedType(owner);
        switch (baseType) {
            case "string":
                return this.stringFunction.handle(functionName, node);
            case "array":
                return this.arrayFunction.handle(functionName, node);
            case "unknown":
            case "object":
                // only transpile if the owner name is the static Object
                // or known by the objectFunction transpiler.
                // this prevent error throwing for all kind of declared object methods
                if (ownerName === "Object" || this.objectFunction.isSupported(functionName)) {
                    return this.objectFunction.handle(functionName, node);
                } else if (ownerName === "Math") {
                    this.transpiler.registerError({
                        node: node,
                        message: `Math functions are currently not supported!`
                    });
                    return "[ERROR]";
                }
                break;
        }

        // transpile params
        const params = node.arguments.map(n => this.transpiler.transpileNode(n, node));

        // check this param
        const hasThisParam = this.doesMethodDeclarationHasThisParam(node);

        // use the default access pattern
        return `${ownerName}${hasThisParam ? "." : ":"}${functionName}(»${params.join(`,»`)}${params.length > 0 ? this.transpiler.space() : ""})`;
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