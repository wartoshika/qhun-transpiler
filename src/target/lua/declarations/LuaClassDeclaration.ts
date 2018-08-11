import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";
import { Types } from "../../../transpiler/Types";

export interface LuaClassDeclaration extends BaseTarget, Target { }
export class LuaClassDeclaration implements Partial<Target> {

    public transpileClassDeclaration(node: ts.ClassDeclaration): string {

        // check if this is an unnamed class
        if (!node.name) {
            throw new UnsupportedError("Classes without a name are not supported!", node);
        }

        // get the name of the class
        const name = this.transpileNode(node.name);

        // add class export
        if (this.hasExportModifier(node)) {
            this.addExport(name, node);
        }

        // get the heritage class name if available
        const superClassName = this.getSuperClassName(node);

        // get all static properties
        const staticProperties = node.members
            .filter(ts.isPropertyDeclaration)
            .filter(Types.isStatic);

        // all non static properties
        const nonStaticProperties = node.members
            .filter(ts.isPropertyDeclaration)
            .filter(prop => !Types.isStatic(prop));

        // all methods that has a valid body
        const methods = node.members
            .filter(ts.isMethodDeclaration)
            .filter(method => !!method.body);

        // all constructors that have a body
        const constructor = node.members
            .filter(ts.isConstructorDeclaration)
            .filter(ctor => !!ctor.body);

        // begin by writing the class head
        const classDeclaration: string[] = [
            `local ${name} = {}`,
            `${name}.__index = ${name}`
        ];

        // add heritage
        if (superClassName) {
            classDeclaration.push(`${name}.__super = ${superClassName}`);
        }

        // other members
        classDeclaration.push(this.transpileStaticProperties(name, staticProperties));
        classDeclaration.push(this.transpileConstructor(name, superClassName, nonStaticProperties, constructor, node));

        // return the class declaration
        return classDeclaration.join("\n");

    }

    /**
     * transpile the given static properties
     * @param className the current class name
     * @param properties the properties to transpile
     */
    private transpileStaticProperties(className: string, properties: ts.PropertyDeclaration[]): string {

        return properties.map(property => {
            // get the property name
            const propertyName = this.transpileNode(property.name);

            // get the initializer
            const initializer = this.transpileNode(property.initializer);

            // add those two params
            return `${className}.${propertyName} = ${initializer || "nil"}`;
        }).join("\n");
    }

    /**
     * transpile the given constructor
     * @param className the current class name
     * @param superClassName the super class name
     * @param nonStaticProperties all non static properties
     * @param constructors the constructor declaration stack
     * @param node the current class declaration node
     */
    private transpileConstructor(
        className: string,
        superClassName: string,
        nonStaticProperties: ts.PropertyDeclaration[],
        constructors: ts.ConstructorDeclaration[],
        node: ts.ClassDeclaration
    ): string {

        // make sure that there is only one constructor
        if (constructors.length > 1) {
            throw new UnsupportedError(`Multiple constructors with a body are unsupported!`, node);
        } else if (constructors.length === 0) {

            // no constructor given, create a new one
            constructors = [
                ts.createConstructor([], [], [], ts.createBlock([], true))
            ];
        }

        // get the one constructor
        const constructor = constructors[0];

        // get all parameters
        const aditionalParams: ts.ParameterDeclaration[] = [];
        const constructorParams = ["self", ...constructor.parameters.map(param => {

            // check for param modifiers like public, protected and private
            if (Types.hasExplicitVisibility(param)) {
                aditionalParams.push(param);
            }

            // get the param name
            let paramName = this.transpileNode(param.name);
            if (param.dotDotDotToken) {
                paramName = "...";
            }

            return paramName;
        })].filter(param => !!param);

        // write method signature
        const signature = [
            `function ${className}.__new(`,
            constructorParams.join(", "),
            `)`
        ].join("");

        // add aditional params and param initializers to the body
        const bodyHead: string[] = [
            ...nonStaticProperties.map(param => {

                // get the param name
                const paramName = this.transpileNode(param.name);
                const initializer = this.transpileNode(param.initializer);

                // add the var content to the current class context
                return `self.${paramName} = ${initializer || "nil"}`;
            }),
            ...constructor.parameters
                .filter(param => !!param.initializer || param.dotDotDotToken)
                .map(param => {

                    // get param name
                    const paramName = this.transpileNode(param.name);
                    const initializer = this.transpileNode(param.initializer);

                    // add rest param
                    if (param.dotDotDotToken) {
                        return `local ${paramName} = {...}\n`;
                    }

                    // add the default initializer
                    return `if ${paramName} == nil then ${paramName} = ${initializer} end`;
                }),
            ...aditionalParams.map(param => {

                // get the param name
                const paramName = this.transpileNode(param.name);

                // add the var content to the current class context
                return `self.${paramName} = ${paramName}`;
            })
        ];

        // get the body of the constructor
        const bodyTail = this.transpileNode(constructor.body);

        // return the signature and body
        return [
            signature,
            this.removeEmptyLines(this.addSpacesToString([...bodyHead, bodyTail].join("\n"), 2)),
            `end`
        ].join("\n");
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
                    superName = this.typeChecker.getTypeAtLocation(node).symbol.escapedName.toString();
                    return true;
                }
            });
        }

        return superName;
    }
}
