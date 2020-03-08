import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { DeclarationTranspiler } from "../../../transpiler";
import { ImportEqualsDeclaration } from "typescript";

export class Lua51ImportEqualsDeclaration extends PartialTranspiler implements Partial<DeclarationTranspiler> {

    /**
     * @inheritdoc
     */
    public importEqualsDeclaration(node: ImportEqualsDeclaration): string {

        return "ImportEqualsDeclaration";
    }
}