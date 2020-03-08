import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { DeclarationTranspiler } from "../../../transpiler";
import { InterfaceDeclaration } from "typescript";

export class Lua51InterfaceDeclaration extends PartialTranspiler implements Partial<DeclarationTranspiler> {

    /**
     * @inheritdoc
     */
    public interfaceDeclaration(node: InterfaceDeclaration): string {

        return "InterfaceDeclaration";
    }
}