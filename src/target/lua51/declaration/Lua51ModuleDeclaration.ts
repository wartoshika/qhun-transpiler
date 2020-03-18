import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { DeclarationTranspiler } from "../../../transpiler";
import { ModuleDeclaration } from "typescript";
import { UnsupportedNodeException } from "../../../exception/UnsupportedNodeException";

export class Lua51ModuleDeclaration extends PartialTranspiler implements Partial<DeclarationTranspiler> {

    /**
     * @inheritdoc
     */
    public moduleDeclaration(node: ModuleDeclaration): string {

        this.transpiler.registerError({
            node: node,
            message: `Module declarations are unsupported!`
        });
        return "[ERROR]";
    }
}