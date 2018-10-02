import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";
import { Types } from "../../../transpiler/Types";
import { LuaKeywords } from "../LuaKeywords";
import { StaticReflection } from "../../../config/StaticReflection";

declare type ReflectionContext = {
    [methodName: string]: string[]
};

export interface LuaClassDeclaration extends BaseTarget, Target { }
export class LuaClassDeclaration implements Partial<Target> {

    public lastParsedClassName: string;

    public transpileClassDeclaration(node: ts.ClassDeclaration): string {

        // check if this is an unnamed class
        if (!node.name) {
            throw new UnsupportedError("Classes without a name are not supported!", node);
        }

        // get the name of the class
        const name = this.transpileNode(node.name);

        this.lastParsedClassName = name;

        // add class export
        if (this.hasExportModifier(node)) {
            this.addExport(name, node);
        }

        // check for static reflection
        const reflection = this.getStaticReflection(node, name, this.project.config.staticReflection);

        // return the whole thing
        const classDef = [
            this.writeClassHead(name, node)
        ];

        // check for reflections
        if (reflection) {
            classDef.push(reflection);
        }

        // add methods
        classDef.push(this.writeClassMethods(name, node));

        // add decorators
        classDef.push(this.transpileClassDecorator(node));

        return classDef.join("\n") + "\n";
    }

    /**
     * writes the class head including static properties
     * @param className the class name
     * @param node the class declaration node
     */
    private writeClassHead(className: string, node: ts.ClassDeclaration): string {

        // define the class head stack
        const classHead: string[] = [];

        // get static properties that have initializers
        const initProperties = node.members
            .filter(ts.isPropertyDeclaration)
            .filter(prop => !!prop.initializer);

        const staticInitProperties = initProperties.filter(Types.isStatic);
        const nonStaticInitProperties = initProperties.filter(p => !Types.isStatic(p));

        // get super class name if available
        const superClass = this.getSuperClassName(node);

        // add the lua class initializer
        if (superClass) {
            classHead.push(`local ${className} = ${superClass}.${LuaKeywords.CLASS_NEW_FUNCTION_NAME}()`);
            classHead.push(`${className}.${LuaKeywords.CLASS_SUPER_REFERENCE_NAME} = ${superClass}`);
        } else {
            classHead.push(`local ${className} = {}`);
        }

        // add the reference index
        classHead.push(`${className}.__index = ${className}`);

        // add class name when reflection is set
        if (this.project.config.staticReflection & StaticReflection.CLASS_NAME) {
            classHead.push(`${className}.__name = ${this.transpileStringLiteral(ts.createStringLiteral(className))}`);
        }

        // add static properties
        classHead.push(...staticInitProperties.map(prop => {
            const propertyName = this.transpileNode(prop.name);
            const initializer = this.transpileNode(prop.initializer);
            return `${className}.${propertyName} = ${initializer}`;
        }));

        // add static class initializer function
        classHead.push(...[
            `function ${className}.${LuaKeywords.CLASS_NEW_FUNCTION_NAME}(self, ...)`,
            this.addSpacesToString(`local ${LuaKeywords.CLASS_INSTANCE_LOCAL_NAME} = setmetatable({}, ${className})`, 2),
            // add non static properties
            this.addSpacesToString(
                nonStaticInitProperties.map(p => {
                    const propertyName = this.transpileNode(p.name);
                    const initializer = this.transpileNode(p.initializer);
                    return `${LuaKeywords.CLASS_INSTANCE_LOCAL_NAME}.${propertyName} = ${initializer}`;
                }).join("\n"), 2),
            // add property decorators
            this.addSpacesToString(node.members
                .filter(ts.isPropertyDeclaration)
                .filter(prop => prop.decorators && prop.decorators.length > 0)
                .map(dec => this.transpilePropertyDecorator(dec))
                .filter(dec => !!dec)
                .join("\n"), 2),
            // add the constructor call
            this.addSpacesToString(`if self and ${className}.${LuaKeywords.CLASS_INIT_FUNCTION_NAME} then`, 2),
            this.addSpacesToString(`${className}.${LuaKeywords.CLASS_INIT_FUNCTION_NAME}(${LuaKeywords.CLASS_INSTANCE_LOCAL_NAME}, ...)`, 4),
            this.addSpacesToString(`end`, 2),
            // return the constructed instance
            this.addSpacesToString(`return ${LuaKeywords.CLASS_INSTANCE_LOCAL_NAME}`, 2),
            `end`
        ]);

        return this.removeEmptyLines(classHead.join("\n"));
    }

    /**
     * write the class methods including constructor
     * @param className the class name
     * @param node the class declaration
     */
    private writeClassMethods(className: string, node: ts.ClassDeclaration): string {

        // declare the class method stack
        const classMethods: string[] = [];
        const superClassName = this.getSuperClassName(node);

        // get all constructors, ignore overload signatures
        const constructors = node.members
            .filter(ts.isConstructorDeclaration)
            .filter(constructor => !!constructor.body);

        // get all methods, ignore overload signatures
        const methods = node.members
            .filter(ts.isMethodDeclaration)
            .filter(method => !!method.body);

        // start by checking the amount of constructors
        if (constructors.length > 1) {
            throw new UnsupportedError("Multiple class construcor functions with a body are unsupported!", node);
        }

        // check if there are no constructors available
        if (constructors.length < 1 && !superClassName) {

            // create an empty constructor because no super constructor is available
            constructors.push(ts.createConstructor([], [], [], ts.createBlock([])));
        }

        // conat constructor and other methods
        let name: string;
        classMethods.push(...[...constructors, ...methods].map(method => {

            // get the name of the method
            if (ts.isConstructorDeclaration(method)) {

                name = `${className}.${LuaKeywords.CLASS_INIT_FUNCTION_NAME}`;
            } else if (ts.isMethodDeclaration(method)) {
                name = `${className}.${this.transpileNode(method.name)}`;
            }

            // add the self parameter
            const parameters: ts.ParameterDeclaration[] = [
                ts.createParameter([], [], null, "self")
            ];
            method.parameters.forEach(param => {
                parameters.push(param);
            });

            // use the function declaration and remove the local prefix
            return this.transpileNode(ts.createFunctionDeclaration(
                method.decorators,
                method.modifiers,
                method.asteriskToken,
                ts.createIdentifier(name),
                method.typeParameters,
                ts.createNodeArray(parameters),
                method.type,
                method.body,
            )).substr(6);
        }));

        // join by new line
        return classMethods.join("\n");
    }

    /**
     * get the heritage class name or super class name
     * @param node the node to get the super name for
     */
    private getSuperClassName(node: ts.ClassDeclaration): string {

        let superName: string = "";

        // check if there is a heritage clause and if there is an extend keyword
        if (node.heritageClauses) {
            node.heritageClauses.some(clause => {
                if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                    const extendedType = clause.types[0];
                    superName = this.transpileNode(extendedType.expression);
                    return true;
                }
            });
        }

        return superName;
    }

    /**
     * reflects the class method signatures
     * @param node the class to transpile
     * @param name the name of the current class
     * @param flags the bitop flags wich elements should be reflected
     */
    private getStaticReflection(node: ts.ClassDeclaration, className: string, flags: number): string {

        const reflectData: ReflectionContext = {};

        // collect all reflectable members
        node.members.filter(member => {

            if (flags & StaticReflection.CLASS_CONSTRUCTOR && ts.isConstructorDeclaration(member)) {
                return true;
            }
            return false;
        }).forEach((method: ts.ConstructorDeclaration | ts.MethodDeclaration) => {

            // reflect!
            const methodName = this.transpileNode(method.name) || "constructor";
            reflectData[methodName] = method.parameters.map(param => {

                // get the type
                const type = this.typeChecker.getTypeAtLocation(param);

                // does the param has a symbol?
                const symbol = type.getSymbol();
                if (symbol) {

                    return symbol.getEscapedName().toString();
                }

                const guess = (type as any).intrinsicName;
                if (guess !== "error") {
                    return `"${guess}"`;
                }

                return this.transpileKeyword(ts.createNull());
            });
        });

        if (Object.keys(reflectData).length === 0 && flags & StaticReflection.CLASS_CONSTRUCTOR) {

            // no constructur has been given, create an empty constructor signature
            reflectData["constructor" as any] = [] as string[];
        } else if (Object.keys(reflectData).length === 0) {

            // no constructor reflection wanted!
            return "";
        }

        return [
            `${className}.${LuaKeywords.CLASS_STATIC_REFLECTION} = {`,
            this.addSpacesToString(Object.keys(reflectData).map(key => {
                return [
                    `${key} = {`,
                    this.addSpacesToString(reflectData[key].join(",\n"), 2),
                    `}`
                ].join("\n");
            }).join("\n"), 2),
            `}`
        ].join("\n");
    }
}
