import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { DeclarationTranspiler } from "../../../transpiler";
import { ExportDeclaration } from "typescript";

export class Lua51ExportDeclaration extends PartialTranspiler implements Partial<DeclarationTranspiler> {

    /**
     * @inheritdoc
     */
    public exportDeclaration(node: ExportDeclaration): string {

        return "ExportDeclaration";
    }
}