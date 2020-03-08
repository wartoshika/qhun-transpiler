import { ClassDeclaration, PropertyDeclaration, FunctionDeclaration, ParameterDeclaration } from "typescript";
import { PartialTranspiler } from "./impl/PartialTranspiler";

export interface DecoratorTranspiler extends PartialTranspiler {

    /**
     * transpiles existing class level decorators
     * @param node the node to transpile
     */
    classDecorator(node: ClassDeclaration): string;

    /**
     * transpiles existing property level decorators
     * @param node the node to transpile
     */
    propertyDecorator(node: PropertyDeclaration): string;

    /**
     * transpiles existing function level decorators
     * @param node the node to transpile
     */
    functionDecorator(node: FunctionDeclaration): string;

    /**
     * transpiles existing parameter level decorators
     * @param node the node to transpile
     */
    parameterDecorator(node: ParameterDeclaration): string;
}