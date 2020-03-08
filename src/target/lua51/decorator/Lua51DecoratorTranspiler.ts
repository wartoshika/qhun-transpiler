import { DecoratorTranspiler } from "../../../transpiler";
import { ClassDeclaration, PropertyDeclaration, FunctionDeclaration, ParameterDeclaration } from "typescript";
import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";

export class Lua51DecoratorTranspiler extends PartialTranspiler implements DecoratorTranspiler {

    /**
     * @inheritdoc
     */
    public classDecorator(node: ClassDeclaration): string {
        return "classDecorator";
    }

    /**
     * @inheritdoc
     */
    public propertyDecorator(node: PropertyDeclaration): string {
        return "propertyDecorator";
    }

    /**
     * @inheritdoc
     */
    public functionDecorator(node: FunctionDeclaration): string {
        return "functionDecorator";
    }

    /**
     * @inheritdoc
     */
    public parameterDecorator(node: ParameterDeclaration): string {
        return "parameterDecorator";
    }
}