import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { DeclarationTranspiler } from "../../../transpiler";
import { EnumDeclaration } from "typescript";

export class Lua51EnumDeclaration extends PartialTranspiler implements Partial<DeclarationTranspiler> {

    /**
     * @inheritdoc
     */
    public enumDeclaration(node: EnumDeclaration): string {

        return "EnumDeclaration";
    }
}