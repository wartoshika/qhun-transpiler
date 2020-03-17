import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { DeclarationTranspiler } from "../../../transpiler";
import { ClassDeclaration, isPropertyDeclaration, SyntaxKind, isConstructorDeclaration, isMethodDeclaration, createConstructor, createBlock, ParameterDeclaration, createParameter, createFunctionDeclaration, createNodeArray, createIf, createBinary, createIdentifier, createToken, createPropertyAccess, createExpressionStatement, createCall } from "typescript";
import { UnsupportedNodeException } from "../../../exception/UnsupportedNodeException";
import { Lua51Keywords } from "../Lua51Keywords";

export class Lua51ClassDeclaration extends PartialTranspiler implements Partial<DeclarationTranspiler> {

    private readonly CLASS_SUPER_REFERENCE_NAME = this.transpiler.getConfig().obscurify ? Lua51Keywords.CLASS_SUPER_REFERENCE_NAME_OBSCURIFY : Lua51Keywords.CLASS_SUPER_REFERENCE_NAME;
    private readonly CLASS_NEW_FUNCTION_NAME = this.transpiler.getConfig().obscurify ? Lua51Keywords.CLASS_NEW_FUNCTION_NAME_OBSCURIFY : Lua51Keywords.CLASS_NEW_FUNCTION_NAME;
    private readonly CLASS_INSTANCE_LOCAL_NAME = this.transpiler.getConfig().obscurify ? Lua51Keywords.CLASS_INSTANCE_LOCAL_NAME_OBSCURIFY : Lua51Keywords.CLASS_INSTANCE_LOCAL_NAME;
    private readonly CLASS_PREPARE_NON_STATIC = this.transpiler.getConfig().obscurify ? Lua51Keywords.CLASS_PREPARE_NON_STATIC_OBSCURIFY : Lua51Keywords.CLASS_PREPARE_NON_STATIC;
    private readonly CLASS_INIT_FUNCTION_NAME = this.transpiler.getConfig().obscurify ? Lua51Keywords.CLASS_INIT_FUNCTION_NAME_OBSCURIFY : Lua51Keywords.CLASS_INIT_FUNCTION_NAME;

    /**
     * @inheritdoc
     */
    public classDeclaration(node: ClassDeclaration): string {

        // check if this is an unnamed class
        if (!node.name) {
            throw new UnsupportedNodeException("Classes without a name are not supported!", node);
        }

        // get the name of the class
        const name = this.transpiler.transpileNode(node.name);
        this.transpiler.registerClass(name);

        // add class export
        if (this.transpiler.typeHelper().hasExportModifier(node)) {
            this.transpiler.registerExport(name);
        }

        // check for static reflection
        // @todo: relection!
        // const reflection = this.getStaticReflection(node, name, this.project.configuration.targetConfig.staticReflection);

        // return the whole thing
        const classDef = [
            this.writeClassHead(name, node)
        ];

        // check for reflections
        /*if (reflection) {
            classDef.push(reflection);
        }*/

        // add methods
        classDef.push(this.writeClassMethods(name, node));

        // add decorators
        // @todo: add decorator transpiling
        // classDef.push(this.transpiler.transpileNode(node));

        return classDef.join(this.transpiler.break());
    }

    /**
     * writes the class head including static properties
     * @param className the class name
     * @param node the class declaration node
     */
    private writeClassHead(className: string, node: ClassDeclaration): string {

        // define the class head stack
        const classHead: string[] = [];

        // get static properties that have initializers
        const initProperties = node.members
            .filter(isPropertyDeclaration)
            .filter(prop => !!prop.initializer);

        const staticInitProperties = initProperties.filter(this.transpiler.typeHelper().isStatic);
        const nonStaticInitProperties = initProperties.filter(p => !this.transpiler.typeHelper().isStatic(p));

        // get super class name if available
        const superClass = this.getSuperClassName(node);

        // add the lua class initializer
        if (superClass) {
            classHead.push(`local ${className}»=»${superClass}.${this.CLASS_NEW_FUNCTION_NAME}(»{}»)`);
            classHead.push(`${className}.${this.CLASS_SUPER_REFERENCE_NAME}»=»${superClass}`);
        } else {
            classHead.push(`local ${className}»=»{}`);
        }

        // add the reference index
        classHead.push(`${className}.__index»=»${className}`);

        /* @todo: reflection!
        // add class name when reflection is set
        if (this.project.configuration.targetConfig.staticReflection & StaticReflection.CLASS_NAME) {
            classHead.push(`${className}.__name = ${this.transpileStringLiteral(ts.createStringLiteral(className))}`);
        }

        // add class namespace if reflection is set
        if (this.project.configuration.targetConfig.staticReflection & StaticReflection.CLASS_NAMESPACE) {
            classHead.push(`${className}.__namespace = ${this.transpileStringLiteral(ts.createStringLiteral(this.getClassNamespace(node)))}`);
        }*/

        // add static properties
        classHead.push(...staticInitProperties.filter(prop => !!(prop.initializer)).map(prop => {
            const propertyName = this.transpiler.transpileNode(prop.name);
            const initializer = this.transpiler.transpileNode(prop.initializer!);
            return `${className}.${propertyName}»=»${initializer}`;
        }));

        // add static class initializer function
        classHead.push(...[
            `function ${className}.${this.CLASS_NEW_FUNCTION_NAME}(${Lua51Keywords.CLASS_THIS_KEYWORD},»...)`,
            this.transpiler.addIntend(`local ${this.CLASS_INSTANCE_LOCAL_NAME}»=»setmetatable(»{},»${className}»)`),
            // add property decorators
            this.transpiler.addIntend(node.members
                .filter(isPropertyDeclaration)
                .filter(prop => prop.decorators && prop.decorators.length > 0)
                .map(dec => this.transpiler.transpileNode(dec))
                .filter(dec => !!dec)
                .join(this.transpiler.break())),
            // add prepare non static function
            this.transpiler.addIntend(`if ${Lua51Keywords.CLASS_THIS_KEYWORD} and ${className}.${this.CLASS_PREPARE_NON_STATIC} then`),
            this.transpiler.addIntend(`${className}.${this.CLASS_PREPARE_NON_STATIC}(»${this.CLASS_INSTANCE_LOCAL_NAME}»)`, 2),
            this.transpiler.addIntend(`end`),
            // add the constructor call
            this.transpiler.addIntend(`if ${Lua51Keywords.CLASS_THIS_KEYWORD} and ${className}.${this.CLASS_INIT_FUNCTION_NAME} then`),
            this.transpiler.addIntend(`${className}.${this.CLASS_INIT_FUNCTION_NAME}(»${this.CLASS_INSTANCE_LOCAL_NAME},»...»)`, 2),
            this.transpiler.addIntend(`end`),
            // return the constructed instance
            this.transpiler.addIntend(`return ${this.CLASS_INSTANCE_LOCAL_NAME}`),
            `end`
        ]);

        // add non static initializer function
        if (nonStaticInitProperties.length > 0) {
            classHead.push(...[
                `function ${className}.${this.CLASS_PREPARE_NON_STATIC}(»${Lua51Keywords.CLASS_THIS_KEYWORD}»)`,
                // add non static properties
                this.transpiler.addIntend(
                    nonStaticInitProperties.filter(p => !!(p.initializer)).map(p => {
                        const propertyName = this.transpiler.transpileNode(p.name);
                        const initializer = this.transpiler.transpileNode(p.initializer!);
                        return `${Lua51Keywords.CLASS_THIS_KEYWORD}.${propertyName}»=»${initializer}`;
                    }).join(this.transpiler.break())),
                `end`
            ]);
        }

        return classHead.join(this.transpiler.break());
    }

    /**
     * write the class methods including constructor
     * @param className the class name
     * @param node the class declaration
     */
    private writeClassMethods(className: string, node: ClassDeclaration): string {

        // declare the class method stack
        const classMethods: string[] = [];
        const superClassName = this.getSuperClassName(node);

        // get all constructors, ignore overload signatures
        const constructors = node.members
            .filter(isConstructorDeclaration)
            .filter(constructor => !!constructor.body);

        // get all methods, ignore overload signatures
        const methods = node.members
            .filter(isMethodDeclaration)
            .filter(method => !!method.body);

        // start by checking the amount of constructors
        if (constructors.length > 1) {
            throw new UnsupportedNodeException("Multiple class construcor functions with a body are unsupported!", node);
        }

        // check if there are no constructors available
        if (constructors.length < 1 && !superClassName) {

            // create an empty constructor because no super constructor is available
            constructors.push(createConstructor([], [], [], createBlock([])));
        }

        // conat constructor and other methods
        let name: string;
        classMethods.push(...[...constructors, ...methods].map(method => {

            // get the name of the method
            if (isConstructorDeclaration(method)) {

                name = `${className}.${this.CLASS_INIT_FUNCTION_NAME}`;
            } else if (isMethodDeclaration(method)) {
                name = `${className}.${this.transpiler.transpileNode(method.name)}`;
            }

            // add the ${LuaKeywords.CLASS_THIS_KEYWORD} parameter
            const parameters: ParameterDeclaration[] = [
                createParameter([], [], undefined, Lua51Keywords.CLASS_THIS_KEYWORD)
            ];
            method.parameters.forEach(param => {
                parameters.push(param);
            });

            // use the function declaration and remove the local prefix
            return this.transpiler.transpileNode(createFunctionDeclaration(
                method.decorators,
                method.modifiers,
                method.asteriskToken,
                name,
                method.typeParameters,
                createNodeArray(parameters),
                method.type,
                method.body,
            ), node).substr(6);
        }));

        // join by new line
        return classMethods.join(this.transpiler.break());
    }

    /**
     * get the heritage class name or super class name
     * @param node the node to get the super name for
     */
    private getSuperClassName(node: ClassDeclaration): string {

        let superName: string = "";

        // check if there is a heritage clause and if there is an extend keyword
        if (node.heritageClauses) {
            node.heritageClauses.some(clause => {
                if (clause.token === SyntaxKind.ExtendsKeyword) {
                    const extendedType = clause.types[0];
                    superName = this.transpiler.transpileNode(extendedType.expression);
                    return true;
                }
            });
        }

        return superName;
    }
}