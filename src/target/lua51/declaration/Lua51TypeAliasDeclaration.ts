import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { DeclarationTranspiler } from "../../../transpiler";
import { TypeAliasDeclaration } from "typescript";

export class Lua51TypeAliasDeclaration extends PartialTranspiler implements Partial<DeclarationTranspiler> {

    /**
     * @inheritdoc
     */
    public typeAliasDeclaration(node: TypeAliasDeclaration): string {

        return "TypeAliasDeclaration";
    }
}