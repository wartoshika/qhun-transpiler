import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { DeclarationTranspiler } from "../../../transpiler";
import { ModuleDeclaration } from "typescript";

export class Lua51ModuleDeclaration extends PartialTranspiler implements Partial<DeclarationTranspiler> {

    /**
     * @inheritdoc
     */
    public moduleDeclaration(node: ModuleDeclaration): string {

        return "ModuleDeclaration";
    }
}